import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'activities.json')

async function readAll() { return JSON.parse(await fs.readFile(file, 'utf-8')) }
async function writeAll(list: any[]) { await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8') }

export async function POST(req: NextRequest) {
  const b = await req.json()
  const list = await readAll()
  const idx = list.findIndex((x: any) => x.id === b.activityId)
  if (idx < 0) return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  const entry = { address: b.address || '', name: b.name || '', status: 'confirmed' }
  list[idx].signups = list[idx].signups || []
  list[idx].signups.push(entry)
  await writeAll(list)
  return NextResponse.json({ ok: true })
}

