import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

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

export async function GET(req: NextRequest) {
  const sid = req.cookies.get('sid')?.value
  if (!sid) return NextResponse.json({ profile: null })
  const sessions = await readJSON(sessionsFile)
  const users = await readJSON(usersFile)
  const sess = sessions.find((s: any) => s.sid === sid)
  if (!sess) return NextResponse.json({ profile: null })
  const user = users.find((u: any) => u.id === sess.userId)
  if (!user) return NextResponse.json({ profile: null })
  return NextResponse.json({ profile: { nickname: user.nickname, avatar: user.avatar, email: user.email, provider: 'email' } })
}

