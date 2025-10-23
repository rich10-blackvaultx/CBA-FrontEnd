"use client"

import { useWallet } from '@/hooks/useWallet'
import { useTranslations } from 'next-intl'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { createActivity } from '@/services/activities'

export function BaseActions({ baseId, baseName }: { baseId: string; baseName: string }) {
  const { isConnected, address } = useWallet()
  const { openConnectModal } = useConnectModal()
  const t = useTranslations('actions')

  async function handleSignup() {
    if (!isConnected) {
      openConnectModal?.()
      alert(t('connect_wallet'))
      return
    }
    try {
      const topic = prompt('Topic/subject') || `Join ${baseName}`
      await createActivity({
        title: topic,
        baseId,
        startAt: new Date().toISOString().slice(0,16),
        endAt: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0,16),
        timezone: '+00:00',
        ticket: { type: 'free', quota: 1 },
        creatorAddress: address!
      } as any)
      alert('Signed up (mock). You can check /api/activities')
    } catch (e) {
      console.error(e)
      alert('Failed to signup (mock).')
    }
  }

  function handleJoinNode() {
    if (!isConnected) return openConnectModal?.()
    alert('Join node coming soon (mock).')
  }

  return (
    <div className="card p-4 sticky top-24">
      <h4 className="font-semibold mb-2">Actions</h4>
      <div className="space-y-2">
        <button onClick={handleSignup} className="w-full px-4 py-2 rounded-md bg-brand text-white">
          {t('apply')}
        </button>
        <button onClick={handleJoinNode} className="w-full px-4 py-2 rounded-md border">
          {t('join')}
        </button>
        <a href="#map" className="block w-full text-center px-4 py-2 rounded-md border">
          {t('view_map')}
        </a>
      </div>
    </div>
  )
}
