"use client"

import { useEffect, useState, useTransition } from 'react'
import { useParams } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'
import { signMessageAction } from '@/lib/actions'
import { useI18n } from '@/hooks/useI18n'
import { BookingWidget } from '@/components/node/BookingWidget'
import { Reviews } from '@/components/node/Reviews'
import { CityGuide } from '@/components/node/CityGuide'
import { Recommendations } from '@/components/node/Recommendations'
import { NodeFacilities } from '@/components/node/NodeFacilities'
import { CityEssentials } from '@/components/node/CityEssentials'
import { NodeActivities } from '@/components/node/NodeActivities'

export default function NodeDetailPage() {
  const params = useParams<{ locale: string; id: string }>()
  const [node, setNode] = useState<any>(null)
  const { isConnected } = useWallet()
  const [pending, startTransition] = useTransition()
  const { t } = useI18n('nodeUI')

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`/api/nodes?id=${params.id}`)
      const data = await res.json()
      setNode(data)
    })()
  }, [params.id])

  if (!node) return <div className="container-responsive py-6">{t('common.loading')}</div>

  return (
    <div className="container-responsive py-6 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="card overflow-hidden">
          <img src={node.coverUrl} className="w-full h-56 object-cover" />
          <div className="p-4">
            <h1 className="text-2xl font-semibold">{node.name}</h1>
            <p className="text-gray-600">{node.address}</p>
            <p className="text-sm text-gray-500">{t('common.open')}: {node.openTime} · {t('common.seats')}: {node.seats || '-'}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <BookingWidget nodeId={node.id} baseId={node.baseId} openTime={node.openTime} seats={node.seats} />
          <CityGuide baseId={node.baseId} locale={params.locale} />
        </div>
        <NodeFacilities tags={node.tags} />
        <CityEssentials baseId={node.baseId} />
        <Reviews nodeId={node.id} />
        <NodeActivities baseId={node.baseId} nodeId={node.id} locale={params.locale} />
      </div>
      <aside className="space-y-4">
        <Recommendations baseId={node.baseId} locale={params.locale} />
        <div className="card p-4">
          <h4 className="font-semibold mb-2">{t('cta.joinTitle')}</h4>
          <button
            className="w-full px-4 py-2 rounded-md bg-brand text-white disabled:opacity-50"
            disabled={pending}
            onClick={() => {
              if (!isConnected) return alert(t('cta.connectFirst'))
              startTransition(async () => {
                const { message } = await signMessageAction('Join node')
                alert(`Signature requested: ${message}`)
              })
            }}
          >
            {t('cta.joinButton')}
          </button>
        </div>
      </aside>
    </div>
  )
}
