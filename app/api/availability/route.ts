import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const nodesFile = path.join(process.cwd(), 'app', 'api', '_data', 'nodes.json')

async function readNodes() {
  const buf = await fs.readFile(nodesFile, 'utf-8')
  return JSON.parse(buf)
}

function pseudoRandom(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return (h >>> 0) / 2 ** 32
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const nodeId = url.searchParams.get('nodeId')
  const at = url.searchParams.get('at') || new Date().toISOString()
  if (!nodeId) return NextResponse.json({ error: 'nodeId required' }, { status: 400 })
  const nodes = await readNodes()
  const node = nodes.find((n: any) => n.id === nodeId)
  if (!node) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const seats: number = node.seats || 20
  const noise = (node.noiseLevel || 'normal') as 'quiet' | 'normal' | 'lively'
  const baseFactor = noise === 'quiet' ? 0.45 : noise === 'normal' ? 0.6 : 0.75
  const load = Math.min(0.95, Math.max(0.1, baseFactor + (pseudoRandom(nodeId + at.slice(0, 13)) - 0.5) * 0.4))
  const occupied = Math.floor(load * seats)
  return NextResponse.json({ nodeId, at, seats, occupied, available: Math.max(0, seats - occupied), load })
}

