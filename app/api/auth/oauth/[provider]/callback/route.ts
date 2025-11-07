import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'auth-logins.json')

async function readAll() {
  try {
    const buf = await fs.readFile(file, 'utf-8')
    return JSON.parse(buf)
  } catch {
    return [] as any[]
  }
}
async function writeAll(list: any[]) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8')
}

export async function GET(req: NextRequest, ctx: any) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const { provider } = (await ctx?.params) || ({} as any)
  const list = await readAll()
  const idx = list.findIndex((x: any) => x.state === state && x.provider === provider)
  if (idx === -1) return NextResponse.json({ ok: false, error: 'state_not_found' }, { status: 400 })

  // For local dev without credentials, we fall back to a mocked profile.
  let profile: any = {
    nickname: provider === 'github' ? 'GitHub User' : provider === 'google' ? 'Google User' : 'OCID User',
    avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${provider}`,
    provider
  }
  try {
    // If you set envs, you can exchange real tokens here.
    if (!code) throw new Error('missing_code')
    // Real token/profile exchange omitted; customize as needed.
  } catch {}

  list[idx] = { ...list[idx], status: 'done', profile, finishedAt: new Date().toISOString() }
  await writeAll(list)

  return new NextResponse('<html><body>Login success. You can close this window.</body></html>', {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  })
}
