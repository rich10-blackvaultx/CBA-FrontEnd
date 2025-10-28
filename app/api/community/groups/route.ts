import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'community', 'groups.json')

async function ensure() { try { await fs.access(file) } catch { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, '[]', 'utf-8') } }
async function readAll() { await ensure(); return JSON.parse(await fs.readFile(file, 'utf-8')) }
async function writeAll(list: any[]) { await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8') }

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const city = url.searchParams.get('city')
  const skill = url.searchParams.get('skill')
  const list = await readAll()
  const filtered = list
    .filter((g: any) => (city ? String(g.city || '').toLowerCase() === city.toLowerCase() : true))
    .filter((g: any) => (skill ? (g.tags || []).map((t: string) => t.toLowerCase()).includes(skill.toLowerCase()) : true))
  return NextResponse.json(filtered)
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const list = await readAll()
  const entry = { id: Math.random().toString(36).slice(2), name: b.name, city: b.city || '', tags: b.tags || [], members: [], desc: b.desc || '' }
  list.unshift(entry)
  await writeAll(list)
  return NextResponse.json(entry, { status: 201 })
}

