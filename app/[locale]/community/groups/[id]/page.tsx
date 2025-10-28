"use client"

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

export default function GroupDetailPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>()
  const [group, setGroup] = useState<any>(null)
  const [topics, setTopics] = useState<any[]>([])
  const [tab, setTab] = useState<'forum' | 'events'>('forum')
  const [form, setForm] = useState({ title: '', type: 'article', content: '' })

  useEffect(() => {
    ;(async () => {
      const [g, t] = await Promise.all([
        fetch(`/api/community/groups/${id}`).then((r) => r.json()),
        fetch(`/api/community/topics?groupId=${id}`).then((r) => r.json())
      ])
      setGroup(g); setTopics(t)
    })()
  }, [id])

  const list = topics
  const canSubmit = form.title.trim().length > 0

  if (!group) return <div className="container-responsive py-6">Loading...</div>
  return (
    <div className="container-responsive py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{group.name}</h1>
          <div className="text-sm text-gray-600">{group.city} · {(group.tags || []).join(', ')}</div>
        </div>
        <a className="px-3 py-1.5 rounded-md border text-sm" href={`/api/community/ics?groupId=${group.id}`}>Calendar (.ics)</a>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setTab('forum')} className={`px-3 py-1.5 rounded-md border text-sm ${tab==='forum' ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>Forum</button>
        <button onClick={() => setTab('events')} className={`px-3 py-1.5 rounded-md border text-sm ${tab==='events' ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>Events</button>
      </div>

      {tab === 'forum' ? (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            {list.map((t) => (
              <div key={t.id} className="card p-3">
                <div className="text-sm text-gray-600">{t.type}</div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm mt-1 line-clamp-2">{t.content}</div>
                <div className="text-xs text-gray-600 mt-1">{t.author} · {new Date(t.createdAt).toLocaleString()} · {t.replies} replies</div>
              </div>
            ))}
          </div>
          <div className="card p-3 space-y-2">
            <div className="font-semibold">Create topic</div>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700">
              <option value="article">article</option>
              <option value="question">question</option>
              <option value="knowledge">knowledge</option>
            </select>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
            <textarea placeholder="Content" value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
            <button disabled={!canSubmit} onClick={async () => {
              const res = await fetch('/api/community/topics', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, groupId: id }) })
              const created = await res.json(); setTopics((l) => [created, ...l]); setForm({ title: '', type: 'article', content: '' })
            }} className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50">Submit</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Upcoming activities (linked via .ics)</div>
          <div className="card p-3">No events yet.</div>
        </div>
      )}
    </div>
  )
}

