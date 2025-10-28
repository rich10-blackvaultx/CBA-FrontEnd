import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'community', 'groups.json')

async function readAll() { return JSON.parse(await fs.readFile(file, 'utf-8')) }
export async function GET(_: NextRequest, ctx: { params: { id: string } }) {
  const list = await readAll()
  const found = list.find((g: any) => g.id === ctx.params.id)
  if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(found)
}

