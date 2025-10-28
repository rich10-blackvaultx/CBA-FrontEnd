import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const basesFile = path.join(process.cwd(), 'app', 'api', '_data', 'bases.json')
const nodesFile = path.join(process.cwd(), 'app', 'api', '_data', 'nodes.json')

async function readJSON(file: string) {
  const buf = await fs.readFile(file, 'utf-8')
  return JSON.parse(buf)
}

function scoreNode(node: any, base: any, skills: string[], interests: string[]) {
  const tags = (node.tags || []).map((t: string) => t.toLowerCase())
  const topSkills = (base?.signals?.topSkills || []).map((s: string) => s.toLowerCase())
  let s = 0
  s += skills.filter((k) => topSkills.includes(k)).length * 2
  s += interests.filter((i) => tags.includes(i)).length * 1.5
  // prefer cowork for productivity
  s += node.type === 'cowork' ? 0.5 : 0
  return s
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const skills = (url.searchParams.get('skills') || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  const interests = (url.searchParams.get('interests') || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  const baseId = url.searchParams.get('baseId') || ''
  const [bases, nodes] = await Promise.all([readJSON(basesFile), readJSON(nodesFile)])
  const byId = new Map(bases.map((b: any) => [b.id, b]))
  const list = nodes
    .filter((n: any) => (baseId ? n.baseId === baseId : true))
    .map((n: any) => ({
      ...n,
      _score: scoreNode(n, byId.get(n.baseId), skills, interests)
    }))
    .sort((a: any, b: any) => b._score - a._score)
    .slice(0, 8)
  return NextResponse.json(list)
}

