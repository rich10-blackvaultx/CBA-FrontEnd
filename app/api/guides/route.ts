import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const basesFile = path.join(process.cwd(), 'app', 'api', '_data', 'bases.json')
const postsFile = path.join(process.cwd(), 'app', 'api', '_data', 'posts.json')

async function readJSON(file: string) {
  const buf = await fs.readFile(file, 'utf-8')
  return JSON.parse(buf)
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const baseId = url.searchParams.get('baseId')
  const bases = await readJSON(basesFile)
  const posts = await readJSON(postsFile)
  if (!baseId) return NextResponse.json([])
  const base = bases.find((b: any) => b.id === baseId)
  if (!base) return NextResponse.json([])
  const tag = (base.slug || '').toLowerCase()
  const guides = posts.filter((p: any) => (p.tags || []).map((t: string) => String(t).toLowerCase()).includes(tag))
  return NextResponse.json(guides)
}

