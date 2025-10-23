import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'activities.json')

async function readAll() {
  const buf = await fs.readFile(file, 'utf-8')
  return JSON.parse(buf)
}

async function writeAll(list: any[]) {
  await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8')
}

export async function GET() {
  const list = await readAll()
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const list = await readAll().catch(() => [])
  const entry = { id: randomUUID(), ...body }
  list.unshift(entry)
  await writeAll(list)
  return NextResponse.json({ ok: true, id: entry.id })
}

