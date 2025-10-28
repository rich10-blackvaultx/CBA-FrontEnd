import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'community', 'contrib.json')

export async function GET() {
  try {
    const list = JSON.parse(await fs.readFile(file, 'utf-8'))
    const byUser: Record<string, number> = {}
    for (const c of list) { byUser[c.user] = (byUser[c.user] || 0) + (c.points || 0) }
    const rows = Object.entries(byUser).map(([user, points]) => ({ user, points })).sort((a, b) => b.points - a.points)
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json([])
  }
}

