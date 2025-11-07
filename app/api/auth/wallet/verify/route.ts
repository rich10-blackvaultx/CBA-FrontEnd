import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { verifyMessage } from 'viem'

const noncesFile = path.join(process.cwd(), 'app', 'api', '_data', 'wallet-nonces.json')
const usersFile = path.join(process.cwd(), 'app', 'api', '_data', 'users.json')
const sessionsFile = path.join(process.cwd(), 'app', 'api', '_data', 'sessions.json')

async function readJSON(file: string) {
  try {
    const buf = await fs.readFile(file, 'utf-8')
    return JSON.parse(buf)
  } catch {
    return [] as any[]
  }
}
async function writeJSON(file: string, data: any) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8')
}

export async function POST(req: NextRequest) {
  const { address, message, signature } = await req.json().catch(() => ({}))
  if (!address || !message || !signature) return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  const nonces = await readJSON(noncesFile)
  const found = nonces.find((x: any) => x.address?.toLowerCase() === String(address).toLowerCase())
  if (!found) return NextResponse.json({ error: 'nonce_not_found' }, { status: 400 })

  const ok = await verifyMessage({ address, message, signature })
  if (!ok) return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })

  // ensure user
  const users = await readJSON(usersFile)
  let user = users.find((u: any) => u.wallet?.toLowerCase() === String(address).toLowerCase())
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email: null,
      wallet: address,
      nickname: 'Wallet User',
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(address)}`,
      provider: 'wallet',
      createdAt: new Date().toISOString()
    }
    users.push(user)
    await writeJSON(usersFile, users)
  }

  // create session
  const sid = crypto.randomUUID()
  const sessions = await readJSON(sessionsFile)
  sessions.unshift({ sid, userId: user.id, createdAt: new Date().toISOString() })
  await writeJSON(sessionsFile, sessions)

  const res = NextResponse.json({ profile: { nickname: user.nickname, avatar: user.avatar, provider: 'metamask', address } })
  res.cookies.set('sid', sid, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}

