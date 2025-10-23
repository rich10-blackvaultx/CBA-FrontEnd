import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const baseFile = path.join(process.cwd(), 'app', 'api', '_data', 'bases.json')
const nodesFile = path.join(process.cwd(), 'app', 'api', '_data', 'nodes.json')
const postsFile = path.join(process.cwd(), 'app', 'api', '_data', 'posts.json')

async function readJSON(file: string) {
  const buf = await fs.readFile(file, 'utf-8')
  return JSON.parse(buf)
}

function enrichBase(base: any, nodes: any[], posts: any[]) {
  const summary = base.summary || {
    monthlyCost: base.monthlyCost,
    currency: base.cost?.currency || 'USD',
    internetMbps: base.internetMbps,
    visaLevel: base.visaLevel,
    safety: base.safety,
    community: base.communityScore,
    stayDays: 90,
    climate: base.climate
  }
  const cost = base.cost || { housing: 700, cowork: 200, food: 250, commute: 50, currency: 'USD' }
  const signals = base.signals || {
    active30d: 9,
    residents30d: 72,
    topSkills: ['AI', 'Web3', 'Design'],
    faqs: [{ q: '签证多久？', a: '免签30天，可延长。' }]
  }
  const timeline = (base.timeline || []).map((t: any, i: number) => ({ ...t, verify: t.verify || (i < 3 ? ['完成入住'] : []) }))
  const nodesOfBase = nodes
    .filter((n) => n.baseId === base.id)
    .map((n) => ({
      id: n.id,
      name: n.name,
      type: n.type,
      address: n.address,
      openTime: n.openTime,
      rating: n.rating || 4.6,
      amenities: n.tags || ['wifi', 'power'],
      noiseLevel: n.noiseLevel || 'normal',
      seats: n.seats,
      coverUrl: n.coverUrl
    }))
  const stories = (base.stories || base.storyIds || []).slice(0, 3).map((id: string) => {
    const p = posts.find((x) => x.id === id) || {}
    return {
      id: id || p.id || Math.random().toString(36).slice(2),
      author: p.author || 'Community member',
      rating: p.rating || 5,
      updatedAt: p.updatedAt || new Date().toISOString().slice(0, 10),
      avatar: p.avatar,
      content: p.excerpt || p.content || 'Great community and views.'
    }
  })
  return {
    id: base.id,
    slug: base.slug,
    name: base.name,
    country: base.country,
    coverUrl: base.coverUrl,
    summary,
    cost,
    signals,
    timeline,
    nodes: nodesOfBase,
    stories
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  const filter = url.searchParams.get('filter')
  const [list, nodes, posts] = await Promise.all([readJSON(baseFile), readJSON(nodesFile), readJSON(postsFile)])
  if (slug) {
    const found = list.find((b: any) => b.slug === slug)
    if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(enrichBase(found, nodes, posts))
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
