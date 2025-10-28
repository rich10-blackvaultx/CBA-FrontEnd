"use client"

import { ProfileForm } from '@/components/forms/ProfileForm'
import { useUIStore } from '@/stores/useUIStore'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/hooks/useI18n'

export default function MePage() {
  const openNI = useUIStore((s) => s.openNI)
  const favBases = Object.keys(useFavoritesStore((s) => s.bases))
  const favNodes = Object.keys(useFavoritesStore((s) => s.nodes))
  const [bids, setBids] = useState<any[]>([])
  const { t } = useI18n('me')
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/bids')
        setBids(await res.json())
      } catch {}
    })()
  }, [])
  return (
    <div className="container-responsive py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Me</h1>
      <ProfileForm />
      <div className="grid md:grid-cols-2 gap-4">
        {['DID', 'Reputation', 'Orders', 'Favorites'].map((feat) => (
          <button key={feat} onClick={() => openNI(feat)} className="card p-6 text-left">
            <h3 className="font-semibold">{feat}</h3>
            <p className="text-gray-600 text-sm">Coming soon...</p>
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">{t('my_community') || 'My Community'}</h3>
          <div className="flex items-center gap-2">
            <Link href="./create/activity" className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
              {t('create_activity') || 'Create Activity'}
            </Link>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">我的收藏</h3>
          <div className="text-sm">Bases: {favBases.length} · Nodes: {favNodes.length}</div>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">我的报名</h3>
          <p className="text-sm text-gray-600">占位：从 /api/activities 读取</p>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">我的投标 (WIP)</h3>
          <div className="text-sm">{bids.length} 条记录</div>
        </div>
      </div>
    </div>
  )
}
