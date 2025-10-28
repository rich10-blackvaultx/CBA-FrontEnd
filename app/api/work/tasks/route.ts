import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'work', 'tasks.json')

async function ensure() { try { await fs.access(file) } catch { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, '[]', 'utf-8') } }
async function readAll() { await ensure(); return JSON.parse(await fs.readFile(file, 'utf-8')) }
async function writeAll(list: any[]) { await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8') }

export async function GET() { return NextResponse.json(await readAll()) }

export async function POST(req: NextRequest) {
  const body = await req.json()
  const t = { id: Math.random().toString(36).slice(2), title: body.title, assignee: body.assignee || '', status: body.status || 'todo', due: body.due || null }
  const list = await readAll(); list.unshift(t); await writeAll(list)
  return NextResponse.json(t, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const list = await readAll()
  const idx = list.findIndex((x: any) => x.id === body.id)
  if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  list[idx] = { ...list[idx], ...body }
  await writeAll(list)
  return NextResponse.json(list[idx])
}

