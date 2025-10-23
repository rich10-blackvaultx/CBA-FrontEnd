import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Activity, ActivityInput } from '@/types/activity'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'activities.json')

async function readAll(): Promise<Activity[]> {
  try {
    const buf = await fs.readFile(file, 'utf-8')
    return JSON.parse(buf)
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, '[]', 'utf-8')
    return []
  }
}

async function writeAll(list: Activity[]) {
  await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8')
}

export async function GET() {
  const list = await readAll()
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ActivityInput & { creatorAddress?: string }
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const list = await readAll()
      const now = new Date().toISOString()
      const creator = body['creatorAddress'] as string
      const entry: Activity = {
        ...body,
        id: randomUUID(),
        status: 'pending',
        creatorAddress: creator,
        createdAt: now,
        signups: creator ? [{ address: creator, status: 'confirmed' }] : []
      }
      list.unshift(entry)
      await writeAll(list)
      return NextResponse.json(entry)
    } catch (e) {
      if (attempt === 1) throw e
    }
  }
  return NextResponse.json({ ok: false }, { status: 500 })
}
