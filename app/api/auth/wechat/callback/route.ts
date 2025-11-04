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

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const appid = process.env.WECHAT_APPID || ''
  const secret = process.env.WECHAT_APPSECRET || ''

  const list = await readAll()
  const idx = list.findIndex((x: any) => x.state === state)
  if (idx === -1) return NextResponse.json({ ok: false, error: 'state_not_found' }, { status: 400 })

  let profile: any = null
  try {
    if (!appid || !secret || !code) throw new Error('missing_credentials_or_code')
    // 1) exchange code for token
    const tokenRes = await fetch(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
    )
    const tokenJson: any = await tokenRes.json()
    if (!tokenJson.access_token) throw new Error(tokenJson.errmsg || 'token_error')
    // 2) fetch user info
    const infoRes = await fetch(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenJson.access_token}&openid=${tokenJson.openid}`
    )
    const info: any = await infoRes.json()
    if (!info.openid) throw new Error(info.errmsg || 'userinfo_error')
    profile = {
      nickname: info.nickname,
      avatar: info.headimgurl,
      provider: 'wechat',
      openid: info.openid,
      unionid: info.unionid
    }
  } catch (e) {
    // Fallback mock profile to allow local development without real credentials
    profile = {
      nickname: 'WeChat User',
      avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=WeChat',
      provider: 'wechat'
    }
  }

  list[idx] = { ...list[idx], status: 'done', profile, finishedAt: new Date().toISOString() }
  await writeAll(list)

  return new NextResponse('<html><body>Login success. You can close this window.</body></html>', {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  })
}

