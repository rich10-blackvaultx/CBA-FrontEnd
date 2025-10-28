"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function GroupsPage() {
  const { locale } = useParams<{ locale: string }>()
  const [groups, setGroups] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  useEffect(() => { (async () => { const res = await fetch('/api/community/groups'); setGroups(await res.json()) })() }, [])
  const list = useMemo(() => groups
    .filter((g) => (q ? (g.name + g.desc).toLowerCase().includes(q.toLowerCase()) : true))
    .filter((g) => (city ? String(g.city || '').toLowerCase() === city.toLowerCase() : true)), [groups, q, city])
  return (
    <div className="container-responsive py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Groups</h1>
        <div className="flex items-center gap-2">
          <input placeholder="Search..." className="border rounded-md px-2 py-1 bg-white dark:bg-gray-900 dark:border-gray-700" onChange={(e) => setQ(e.target.value)} />
          <input placeholder="City" className="border rounded-md px-2 py-1 bg-white dark:bg-gray-900 dark:border-gray-700" onChange={(e) => setCity(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((g) => (
          <Link key={g.id} href={`/${locale}/community/groups/${g.id}`} className="card p-4">
            <div className="font-semibold">{g.name}</div>
            <div className="text-sm text-gray-600">{g.city} · {(g.tags || []).join(', ')}</div>
            <div className="text-sm mt-1 line-clamp-2">{g.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

