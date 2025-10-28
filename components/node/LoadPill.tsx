"use client"

import { useEffect, useState } from 'react'
import { fetchAvailability } from '@/services/availability'
import { useI18n } from '@/hooks/useI18n'

export function LoadPill({ nodeId }: { nodeId: string }) {
  const { t } = useI18n('nodeUI')
  const [load, setLoad] = useState<number | null>(null)
  useEffect(() => {
    ;(async () => {
      try {
        const a = await fetchAvailability(nodeId)
        setLoad(Math.round(a.load * 100))
      } catch {}
    })()
  }, [nodeId])
  return (
    <div className="absolute right-2 top-2 text-xs bg-black/60 text-white px-2 py-1 rounded-full">
      {load == null ? '...' : t('load.label', { value: String(load) })}
    </div>
  )
}
