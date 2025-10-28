import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'reviews.json')

async function ensureFile() {
  try {
    await fs.access(file)
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, '[]', 'utf-8')
  }
}

async function readAll() {
  await ensureFile()
  const buf = await fs.readFile(file, 'utf-8')
  return JSON.parse(buf)
}

async function writeAll(list: any[]) {
  await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8')
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const nodeId = url.searchParams.get('nodeId')
  const baseId = url.searchParams.get('baseId')
  const list = await readAll()
  const filtered = list.filter((r: any) => (nodeId ? r.nodeId === nodeId : true) && (baseId ? r.baseId === baseId : true))
  return NextResponse.json(filtered)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nodeId, baseId, author, rating, content } = body || {}
  if (!nodeId && !baseId) return NextResponse.json({ error: 'nodeId or baseId required' }, { status: 400 })
  if (!author || !content || typeof rating !== 'number') return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  const list = await readAll()
  const review = { id: Math.random().toString(36).slice(2), nodeId, baseId, author, rating: Math.max(1, Math.min(5, rating)), content, createdAt: new Date().toISOString() }
  list.unshift(review)
  await writeAll(list)
  return NextResponse.json(review, { status: 201 })
}

