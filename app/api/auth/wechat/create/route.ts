import { NextResponse } from 'next/server'
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

export async function GET() {
  const appid = process.env.WECHAT_APPID || ''
  const redirect = process.env.WECHAT_REDIRECT_URI || ''
  const state = randomUUID()

  const base = 'https://open.weixin.qq.com/connect/qrconnect'
  const authorizeUrl = appid && redirect
    ? `${base}?appid=${appid}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`
    : ''

  const list = await readAll()
  list.unshift({ state, status: 'pending', createdAt: new Date().toISOString() })
  await writeAll(list)

  return NextResponse.json({ state, authorizeUrl })
}

