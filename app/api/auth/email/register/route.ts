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

function hashPassword(password: string, salt?: string) {
  const s = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, s, 64).toString('hex')
  return { salt: s, hash }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { email, password, nickname } = body || {}
  if (!email || !password) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }
  const users = await readJSON(usersFile)
  if (users.find((u: any) => u.email?.toLowerCase() === String(email).toLowerCase())) {
    return NextResponse.json({ error: 'email_exists' }, { status: 409 })
  }
  const { salt, hash } = hashPassword(password)
  const user = {
    id: crypto.randomUUID(),
    email: String(email).toLowerCase(),
    password: { salt, hash },
    nickname: nickname || email.split('@')[0],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nickname || email)}`,
    provider: 'email',
    createdAt: new Date().toISOString()
  }
  users.push(user)
  await writeJSON(usersFile, users)

  // create session
  const sid = crypto.randomUUID()
  const sessions = await readJSON(sessionsFile)
  sessions.unshift({ sid, userId: user.id, createdAt: new Date().toISOString() })
  await writeJSON(sessionsFile, sessions)

  const res = NextResponse.json({ profile: { nickname: user.nickname, avatar: user.avatar, provider: 'email', email: user.email } })
  res.cookies.set('sid', sid, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}

