import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'posts.json')

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const buf = await fs.readFile(file, 'utf-8')
  const list = JSON.parse(buf)
  const found = list.find((p: any) => p.id === ctx.params.id)
  if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(found)
}

