import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'essentials.json')

async function ensure() {
  try { await fs.access(file) } catch { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, '[]', 'utf-8') }
}
async function readAll() { await ensure(); return JSON.parse(await fs.readFile(file, 'utf-8')) }

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const baseId = url.searchParams.get('baseId')
  const all = await readAll()
  const found = all.find((x: any) => x.baseId === baseId)
  return NextResponse.json(found || null)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { baseId, visa, insurance, tax, medical } = body || {}
  if (!baseId) return NextResponse.json({ error: 'baseId required' }, { status: 400 })
  const all = await readAll()
  const idx = all.findIndex((x: any) => x.baseId === baseId)
  const entry = { baseId, visa: visa || '', insurance: insurance || '', tax: tax || '', medical: medical || '' }
  if (idx >= 0) all[idx] = entry
  else all.unshift(entry)
  await fs.writeFile(file, JSON.stringify(all, null, 2), 'utf-8')
  return NextResponse.json(entry, { status: 201 })
}

