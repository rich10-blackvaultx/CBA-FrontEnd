import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'bookings.json')

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
  const { nodeId, baseId, start, end, type, includeHousing, includeCowork, timezone, note } = body || {}
  if (!start || !end || !type) return NextResponse.json({ error: 'missing fields' }, { status: 400 })
  if (!nodeId && !baseId) return NextResponse.json({ error: 'nodeId or baseId required' }, { status: 400 })
  const booking = {
    id: Math.random().toString(36).slice(2),
    nodeId,
    baseId,
    start,
    end,
    type,
    includeHousing: Boolean(includeHousing),
    includeCowork: Boolean(includeCowork),
    timezone: timezone || 'UTC',
    note: note || '',
    createdAt: new Date().toISOString(),
    status: 'pending'
  }
  const list = await readAll()
  list.unshift(booking)
  await writeAll(list)
  return NextResponse.json(booking, { status: 201 })
}

