import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'app', 'api', '_data', 'activities.json')

function toICS(events: any[]) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Glomia//Community//EN'
  ]
  for (const e of events) {
    const uid = e.id + '@glomia'
    const dtStart = (e.startAt || '').replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')
    const dtEnd = (e.endAt || '').replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${uid}`)
    if (dtStart) lines.push(`DTSTART:${dtStart}`)
    if (dtEnd) lines.push(`DTEND:${dtEnd}`)
    lines.push(`SUMMARY:${e.title}`)
    lines.push('END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const groupId = url.searchParams.get('groupId')
  const list = JSON.parse(await fs.readFile(file, 'utf-8'))
  const events = list.filter((e: any) => (groupId ? (e.groupId === groupId) : true))
  const ics = toICS(events)
  return new NextResponse(ics, { headers: { 'content-type': 'text/calendar' } })
}

