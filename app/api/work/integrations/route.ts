import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'work', 'integrations.json')

async function ensure() { try { await fs.access(file) } catch { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, '{}', 'utf-8') } }
async function readAll() { await ensure(); return JSON.parse(await fs.readFile(file, 'utf-8')) }
async function writeAll(obj: any) { await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf-8') }

export async function GET() { return NextResponse.json(await readAll()) }

export async function POST(req: NextRequest) {
  const body = await req.json()
  await writeAll(body)
  return NextResponse.json(body, { status: 201 })
}

