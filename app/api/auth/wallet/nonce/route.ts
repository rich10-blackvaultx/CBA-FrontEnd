import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

const noncesFile = path.join(process.cwd(), 'app', 'api', '_data', 'wallet-nonces.json')

async function readAll() {
  try {
    const buf = await fs.readFile(noncesFile, 'utf-8')
    return JSON.parse(buf)
  } catch {
    return [] as any[]
  }
}
async function writeAll(list: any[]) {
  await fs.mkdir(path.dirname(noncesFile), { recursive: true })
  await fs.writeFile(noncesFile, JSON.stringify(list, null, 2), 'utf-8')
}

export async function POST(req: NextRequest) {
  const { address } = await req.json().catch(() => ({}))
  if (!address) return NextResponse.json({ error: 'missing_address' }, { status: 400 })
  const list = await readAll()
  const nonce = crypto.randomBytes(16).toString('hex')
  const msg = `Sign this message to log in. Nonce: ${nonce}`
  const idx = list.findIndex((x: any) => x.address?.toLowerCase() === String(address).toLowerCase())
  if (idx >= 0) list[idx] = { address, nonce, message: msg, createdAt: new Date().toISOString() }
  else list.push({ address, nonce, message: msg, createdAt: new Date().toISOString() })
  await writeAll(list)
  return NextResponse.json({ nonce, message: msg })
}

