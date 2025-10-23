import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'bases.json')

async function readAll() {
  const buf = await fs.readFile(file, 'utf-8')
  return JSON.parse(buf)
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  const filter = url.searchParams.get('filter')
  const list = await readAll()
  if (slug) {
    const found = list.find((b: any) => b.slug === slug)
    if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(found)
  }
  if (filter) {
    try {
      const f = JSON.parse(filter)
      const filtered = list.filter((b: any) => {
        if (f.budget && b.monthlyCost > f.budget) return false
        if (f.internet && b.internetMbps < f.internet) return false
        if (f.visa && b.visaLevel !== f.visa) return false
        if (f.climate && b.climate !== f.climate) return false
        if (f.community && b.communityScore * 20 < f.community) return false
        return true
      })
      return NextResponse.json(filtered)
    } catch {
      // ignore parse error
    }
  }
  return NextResponse.json(list)
}

