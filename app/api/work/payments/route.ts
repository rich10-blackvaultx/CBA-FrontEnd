import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'work', 'payments.json')

async function ensure() { try { await fs.access(file) } catch { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, '[]', 'utf-8') } }
async function readAll() { await ensure(); return JSON.parse(await fs.readFile(file, 'utf-8')) }
async function writeAll(list: any[]) { await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8') }

export async function GET() { return NextResponse.json(await readAll()) }

export async function POST(req: NextRequest) {
  const body = await req.json()
  const p = { id: Math.random().toString(36).slice(2), to: body.to || 'Me', amount: body.amount || 0, currency: body.currency || 'USDC', method: body.method || 'stablecoin', status: 'pending', createdAt: new Date().toISOString() }
  const list = await readAll(); list.unshift(p); await writeAll(list)
  return NextResponse.json(p, { status: 201 })
}

