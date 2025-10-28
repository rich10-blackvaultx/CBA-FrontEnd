"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function OSSProjectsPage() {
  const { locale } = useParams<{ locale: string }>()
  const [list, setList] = useState<any[]>([])
  useEffect(() => { (async () => { const res = await fetch('/api/community/projects'); setList(await res.json()) })() }, [])
  return (
    <div className="container-responsive py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Open-source Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((p) => (
          <Link key={p.id} href={`/${locale}/community/projects/${p.id}`} className="card p-4">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">{(p.tags || []).join(', ')}</div>
            <div className="text-sm mt-1 line-clamp-2">{p.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

