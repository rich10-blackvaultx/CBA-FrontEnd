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

export async function GET(req: NextRequest, ctx: any) {
  const url = new URL(req.url)
  const state = url.searchParams.get('state')
  const { provider } = (await ctx?.params) || ({} as any)
  const list = await readAll()
  const found = list.find((x: any) => x.state === state && x.provider === provider)
  if (!found) return NextResponse.json({ status: 'not_found' })
  return NextResponse.json({ status: found.status, profile: found.profile || null })
}
