import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const repliesFile = path.join(process.cwd(), 'app', 'api', '_data', 'community', 'replies.json')
const topicsFile = path.join(process.cwd(), 'app', 'api', '_data', 'community', 'topics.json')

async function ensure() { try { await fs.access(repliesFile) } catch { await fs.mkdir(path.dirname(repliesFile), { recursive: true }); await fs.writeFile(repliesFile, '[]', 'utf-8') } }
async function readAll() { await ensure(); return JSON.parse(await fs.readFile(repliesFile, 'utf-8')) }
async function writeAll(list: any[]) { await fs.writeFile(repliesFile, JSON.stringify(list, null, 2), 'utf-8') }

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const topicId = url.searchParams.get('topicId')
  const list = await readAll()
  const filtered = list.filter((r: any) => (topicId ? r.topicId === topicId : true))
  return NextResponse.json(filtered)
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const list = await readAll()
  const entry = { id: Math.random().toString(36).slice(2), topicId: b.topicId, author: b.author || 'Anon', content: b.content || '', createdAt: new Date().toISOString() }
  list.push(entry)
  await writeAll(list)
  try {
    const t = JSON.parse(await fs.readFile(topicsFile, 'utf-8'))
    const i = t.findIndex((x: any) => x.id === b.topicId)
    if (i >= 0) { t[i].replies = (t[i].replies || 0) + 1; await fs.writeFile(topicsFile, JSON.stringify(t, null, 2), 'utf-8') }
  } catch {}
  return NextResponse.json(entry, { status: 201 })
}

