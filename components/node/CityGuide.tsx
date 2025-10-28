"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchGuides } from '@/services/guides'
import { useI18n } from '@/hooks/useI18n'

export function CityGuide({ baseId, locale }: { baseId: string; locale: string }) {
  const { t } = useI18n('nodeUI')
  const [guides, setGuides] = useState<any[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        setGuides(await fetchGuides(baseId))
      } catch {}
    })()
  }, [baseId])
  if (!guides.length) return null
  return (
    <div className="card p-4">
      <h4 className="font-semibold mb-2">{t('guides.title')}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {guides.map((g) => (
          <Link key={g.id} href={`/${locale}/guides/${g.id}`} className="flex gap-3 items-center">
            {g.coverUrl ? <img src={g.coverUrl} className="h-12 w-12 object-cover rounded-md" /> : <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-md" />}
            <div>
              <div className="text-sm font-medium">{g.title}</div>
              <div className="text-xs text-gray-600">{g.excerpt || g.updatedAt}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
