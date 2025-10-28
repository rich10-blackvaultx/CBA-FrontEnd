"use client"

import { useEffect, useState } from 'react'
import { fetchEssentials } from '@/services/essentials'
import { useI18n } from '@/hooks/useI18n'

export function CityEssentials({ baseId }: { baseId: string }) {
  const { t } = useI18n('nodeUI')
  const [data, setData] = useState<any>(null)
  useEffect(() => {
    ;(async () => {
      try {
        setData(await fetchEssentials(baseId))
      } catch {}
    })()
  }, [baseId])
  if (!data) return null
  return (
    <div className="card p-4">
      <h4 className="font-semibold mb-3">{t('essentials.title')}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium mb-1">{t('essentials.visa')}</div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.visa || '-'}</div>
        </div>
        <div>
          <div className="font-medium mb-1">{t('essentials.insurance')}</div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.insurance || '-'}</div>
        </div>
        <div>
          <div className="font-medium mb-1">{t('essentials.tax')}</div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.tax || '-'}</div>
        </div>
        <div>
          <div className="font-medium mb-1">{t('essentials.medical')}</div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.medical || '-'}</div>
        </div>
      </div>
    </div>
  )
}
