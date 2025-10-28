import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const topicsFile = path.join(process.cwd(), 'app', 'api', '_data', 'community', 'topics.json')

async function ensure() { try { await fs.access(topicsFile) } catch { await fs.mkdir(path.dirname(topicsFile), { recursive: true }); await fs.writeFile(topicsFile, '[]', 'utf-8') } }
async function readAll() { await ensure(); return JSON.parse(await fs.readFile(topicsFile, 'utf-8')) }
async function writeAll(list: any[]) { await fs.writeFile(topicsFile, JSON.stringify(list, null, 2), 'utf-8') }

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const groupId = url.searchParams.get('groupId')
  const type = url.searchParams.get('type') // article | question | knowledge
  const list = await readAll()
  const filtered = list
    .filter((t: any) => (groupId ? t.groupId === groupId : true))
    .filter((t: any) => (type ? t.type === type : true))
  return NextResponse.json(filtered)
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const list = await readAll()
  const entry = { id: Math.random().toString(36).slice(2), groupId: b.groupId, type: b.type || 'article', title: b.title, content: b.content || '', author: b.author || 'Anon', createdAt: new Date().toISOString(), replies: 0, up: 0 }
  list.unshift(entry)
  await writeAll(list)
  return NextResponse.json(entry, { status: 201 })
}

