import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const projectsFile = path.join(process.cwd(), 'app', 'api', '_data', 'work', 'projects.json')

async function readProjects() { return JSON.parse(await fs.readFile(projectsFile, 'utf-8')) }

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const skills = (url.searchParams.get('skills') || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  const interests = (url.searchParams.get('interests') || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  const tz = (url.searchParams.get('timezone') || '').toLowerCase()
  const list = await readProjects()
  const scored = list.map((p: any) => {
    const pSkills = (p.skills || []).map((s: string) => s.toLowerCase())
    const text = `${p.title || ''} ${p.desc || ''} ${(p.tags || []).join(' ')}`.toLowerCase()
    let score = skills.filter((k) => pSkills.includes(k)).length * 2
    score += interests.filter((i) => text.includes(i)).length * 1.5
    score += tz && String(p.timezone || '').toLowerCase().includes(tz) ? 1 : 0
    return { ...p, _score: score }
  }).sort((a: any, b: any) => b._score - a._score)
  return NextResponse.json(scored.slice(0, 8))
}
