"use client"

import { useEffect, useState } from 'react'
import { fetchRecommendations } from '@/services/recommend'
import { useProfileStore } from '@/stores/useProfileStore'
import Link from 'next/link'
import { useI18n } from '@/hooks/useI18n'

export function Recommendations({ baseId, locale }: { baseId?: string; locale: string }) {
  const { t } = useI18n('nodeUI')
  const skills = useProfileStore((s) => s.skills)
  const interests = useProfileStore((s) => s.interests)
  const setSkills = useProfileStore((s) => s.setSkills)
  const setInterests = useProfileStore((s) => s.setInterests)
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const rec = await fetchRecommendations({ skills, interests, baseId })
        setList(rec)
      } catch {}
    })()
  }, [skills.join(','), interests.join(','), baseId])

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{t('recommend.title')}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-sm">
          <span className="block mb-1">{t('recommend.skills')}</span>
          <input
            placeholder={t('recommend.skills_placeholder')}
            defaultValue={skills.join(', ')}
            onBlur={(e) => setSkills(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700"
          />
        </label>
        <label className="text-sm">
          <span className="block mb-1">{t('recommend.interests')}</span>
          <input
            placeholder={t('recommend.interests_placeholder')}
            defaultValue={interests.join(', ')}
            onBlur={(e) => setInterests(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700"
          />
        </label>
      </div>
      {list.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {list.map((n) => (
            <Link key={n.id} href={`/${locale}/nodes/${n.id}`} className="flex gap-3 items-center">
              <img src={n.coverUrl} className="h-14 w-14 object-cover rounded-md" />
              <div>
                <div className="text-sm font-medium">{n.name}</div>
                <div className="text-xs text-gray-600">{(n.tags || []).join(', ')}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-600">{t('recommend.empty')}</div>
      )}
    </div>
  )
}
