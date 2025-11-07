"use client"

import { useQuery } from '@tanstack/react-query'
import { fetchBases } from '@/services/bases'
import { useState } from 'react'
import { FilterBar, type FilterValue } from '@/components/shared/FilterBar'
import { BaseCard } from '@/components/cards/BaseCard'
import { useParams } from 'next/navigation'
import { PAGINATION } from '@/lib/constants'
import { useI18n } from '@/hooks/useI18n'
import { BasesMap } from '@/components/sections/BasesMap'

export default function BasesPage() {
  const { locale } = useParams<{ locale: string }>()
  const { t } = useI18n()
  const [filter, setFilter] = useState<FilterValue>({})
  const [page, setPage] = useState(1)
  const q = JSON.stringify(filter)
  const {data} = useQuery({
    queryKey: ['bases', q],
    queryFn: () => fetchBases(q),
  })
  const list = data || []
  const start = (page - 1) * PAGINATION.pageSize
  const end = start + PAGINATION.pageSize
  const pageCount = Math.max(1, Math.ceil(list?.length / PAGINATION.pageSize))

  return (
    <div className="container-responsive py-6 space-y-4">
      {/* Module intro hidden per request */}

      <h1 className="text-2xl font-semibold">{t('nav.bases')}</h1>
      <BasesMap bases={list || []} />
      {/* <FilterBar onChange={(v) => { setPage(1); setFilter(v) }} /> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list?.slice(start, end).map((b: any) => (
          <BaseCard key={b.id} base={b} href={`/${locale}/bases/${b.id}`} ctaLabel="More" />
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 mt-4">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 border rounded-md">
          Prev
        </button>
        <span className="text-sm text-gray-600">
          {page}/{pageCount}
        </span>
        <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="px-3 py-2 border rounded-md">
          Next
        </button>
      </div>
    </div>
  )
}
