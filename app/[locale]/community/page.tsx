"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PostCard } from '@/components/cards/PostCard'
import { useUIStore } from '@/stores/useUIStore'

export default function CommunityPage() {
  const { locale } = useParams<{ locale: string }>()
  const [posts, setPosts] = useState<any[]>([])
  const openNI = useUIStore((s) => s.openNI)
  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/community')
      const data = await res.json()
      setPosts(data)
    })()
  }, [])
  return (
    <div className="container-responsive py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Community</h1>
        <button onClick={() => openNI('Create Post')} className="px-4 py-2 rounded-md bg-brand text-white">
          Post
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} href={`/${locale}/community/post/${p.id}`} />
        ))}
      </div>
    </div>
  )
}

