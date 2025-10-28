"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PostCard } from '@/components/cards/PostCard'
import { useUIStore } from '@/stores/useUIStore'
import { useI18n } from '@/hooks/useI18n'

export default function CommunityPage() {
  const { locale } = useParams<{ locale: string }>()
  const [posts, setPosts] = useState<any[]>([])
  const openNI = useUIStore((s) => s.openNI)
  const { t } = useI18n()
  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/community')
      const data = await res.json()
      setPosts(data)
    })()
  }, [])
  return (
    <div className="container-responsive py-6 space-y-4">
      {/* Module intro hidden per request */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <a href={`/${locale}/community/groups`} className="card p-4">
          <div className="font-semibold">{t('nav.groups') || 'Groups'}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('modules.community.features.groups')}</div>
        </a>
        <a href={`/${locale}/community/projects`} className="card p-4">
          <div className="font-semibold">{t('nav.oss') || 'Open-source'}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('modules.community.features.open')}</div>
        </a>
        <a href={`/${locale}/community/leaderboard`} className="card p-4">
          <div className="font-semibold">Leaderboard</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Reputation & points</div>
        </a>
      </div>
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
