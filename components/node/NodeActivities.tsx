"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/hooks/useI18n'

export function NodeActivities({ baseId, nodeId, locale }: { baseId: string; nodeId?: string; locale: string }) {
  const { t } = useI18n('nodeUI')
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/activities')
        const all = await res.json()
        setList(all)
      } catch {}
    })()
  }, [])
  const filtered = useMemo(() => {
    return list
      .filter((a) => (baseId ? a.baseId === baseId : true))
      .filter((a) => (nodeId ? a.nodeId === nodeId : true))
      .sort((a, b) => String(a.startAt).localeCompare(String(b.startAt)))
  }, [list, baseId, nodeId])
  if (!filtered.length) {
    return (
      <div className="card p-4">
        <h3 className="font-semibold mb-2">{t('activities.title')}</h3>
        <p className="text-sm text-gray-600">{t('activities.empty')}</p>
      </div>
    )
  }
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">{t('activities.title')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((a) => (
          <div key={a.id} className="border rounded-md p-3 dark:border-gray-700">
            <div className="text-sm font-medium">{a.title}</div>
            {a.tagline && <div className="text-xs text-gray-600">{a.tagline}</div>}
            <div className="text-xs mt-1 text-gray-500">
              {new Date(a.startAt).toLocaleString()} - {new Date(a.endAt).toLocaleString()} ({a.timezone})
            </div>
            {a.ticket && (
              <div className="text-xs mt-1">{a.ticket.type === 'free' ? t('activities.free') : `${a.ticket.price}-${a.ticket.currency}`} · {t('activities.quota')} {a.ticket.quota}</div>
            )}
            <div className="mt-2 flex justify-end">
              <Link href={`/${locale}/community`} className="text-xs px-2 py-1 rounded-md border dark:border-gray-700">{t('activities.details')}</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
