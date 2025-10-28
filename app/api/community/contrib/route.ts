import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'community', 'contrib.json')

async function ensure() { try { await fs.access(file) } catch { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, '[]', 'utf-8') } }
async function readAll() { await ensure(); return JSON.parse(await fs.readFile(file, 'utf-8')) }
async function writeAll(list: any[]) { await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8') }

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const projectId = url.searchParams.get('projectId')
  const list = await readAll()
  const filtered = list.filter((c: any) => (projectId ? c.projectId === projectId : true))
  return NextResponse.json(filtered)
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const list = await readAll()
  const entry = { id: Math.random().toString(36).slice(2), projectId: b.projectId, user: b.user || 'Anon', type: b.type || 'code', points: b.points || 5, message: b.message || '', createdAt: new Date().toISOString() }
  list.unshift(entry)
  await writeAll(list)
  return NextResponse.json(entry, { status: 201 })
}

