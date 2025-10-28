"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [proj, setProj] = useState<any>(null)
  const [contrib, setContrib] = useState<any[]>([])
  useEffect(() => { (async () => {
    const [p, c] = await Promise.all([
      fetch('/api/community/projects').then(r=>r.json()),
      fetch(`/api/community/contrib?projectId=${id}`).then(r=>r.json())
    ])
    setProj(p.find((x:any)=>x.id===id)); setContrib(c)
  })() }, [id])
  if (!proj) return <div className="container-responsive py-6">Loading...</div>
  return (
    <div className="container-responsive py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{proj.name}</h1>
          <div className="text-sm text-gray-600">{(proj.tags||[]).join(', ')}</div>
        </div>
        <a href="/api/community/leaderboard" className="px-3 py-1.5 rounded-md border text-sm">Leaderboard JSON</a>
      </div>
      <p className="text-sm">{proj.desc}</p>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="card p-3">
          <div className="font-semibold mb-2">Tasks</div>
          <div className="space-y-2">
            {(proj.tasks||[]).map((t:any)=> (
              <div key={t.id} className="border rounded-md p-2 dark:border-gray-700 text-sm flex items-center justify-between">
                <div>{t.title}</div>
                <div>{t.status}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-3">
          <div className="font-semibold mb-2">Contributions</div>
          <div className="space-y-2">
            {contrib.map(c=> (
              <div key={c.id} className="border rounded-md p-2 dark:border-gray-700 text-sm flex items-center justify-between">
                <div>{c.user} · {c.type}</div>
                <div>+{c.points}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input id="msg" placeholder="message" className="flex-1 border rounded-md px-2 py-1 bg-white dark:bg-gray-900 dark:border-gray-700 text-sm" />
            <button className="text-sm px-3 py-1.5 rounded-md border" onClick={async () => {
              const msg = (document.getElementById('msg') as HTMLInputElement)?.value || ''
              const res = await fetch('/api/community/contrib', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ projectId: id, user: 'you', type: 'code', points: 5, message: msg }) })
              const created = await res.json(); setContrib((l)=>[created, ...l])
            }}>Contribute</button>
          </div>
        </div>
      </div>
    </div>
  )
}

