import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
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
  const { provider } = (await ctx?.params) || ({} as any)
  const state = randomUUID()
  let authorizeUrl = ''

  if (provider === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID || ''
    const redirect = process.env.GOOGLE_REDIRECT_URI || ''
    if (clientId && redirect) {
      const base = 'https://accounts.google.com/o/oauth2/v2/auth'
      const scope = encodeURIComponent('openid email profile')
      authorizeUrl = `${base}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=${scope}&state=${state}`
    }
  } else if (provider === 'github') {
    const clientId = process.env.GITHUB_CLIENT_ID || ''
    const redirect = process.env.GITHUB_REDIRECT_URI || ''
    if (clientId && redirect) {
      const base = 'https://github.com/login/oauth/authorize'
      authorizeUrl = `${base}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=read:user%20user:email&state=${state}`
    }
  } else if (provider === 'ocid') {
    const authUrl = process.env.OCID_AUTH_URL || ''
    const clientId = process.env.OCID_CLIENT_ID || ''
    const redirect = process.env.OCID_REDIRECT_URI || ''
    if (authUrl && clientId && redirect) {
      authorizeUrl = `${authUrl}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=openid%20profile%20email&state=${state}`
    }
  }

  const list = await readAll()
  list.unshift({ state, provider, status: 'pending', createdAt: new Date().toISOString() })
  await writeAll(list)
  return NextResponse.json({ state, authorizeUrl })
}
