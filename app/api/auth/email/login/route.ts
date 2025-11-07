import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

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

function verifyPassword(password: string, user: any) {
  if (!user?.password?.salt || !user?.password?.hash) return false
  const h = crypto.scryptSync(password, user.password.salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(h, 'hex'), Buffer.from(user.password.hash, 'hex'))
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { email, password } = body || {}
  if (!email || !password) return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  const users = await readJSON(usersFile)
  const user = users.find((u: any) => u.email?.toLowerCase() === String(email).toLowerCase())
  if (!user || !verifyPassword(password, user)) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 })

  // create session
  const sid = crypto.randomUUID()
  const sessions = await readJSON(sessionsFile)
  sessions.unshift({ sid, userId: user.id, createdAt: new Date().toISOString() })
  await writeJSON(sessionsFile, sessions)

  const res = NextResponse.json({ profile: { nickname: user.nickname, avatar: user.avatar, provider: 'email', email: user.email } })
  res.cookies.set('sid', sid, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}

