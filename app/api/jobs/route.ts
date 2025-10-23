import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'jobs.json')

async function readAll() {
  const buf = await fs.readFile(file, 'utf-8')
  return JSON.parse(buf)
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  const list = await readAll()
  if (id) {
    const found = list.find((j: any) => j.id === id)
    if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(found)
  }
  return NextResponse.json(list)
}

