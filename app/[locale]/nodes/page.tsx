"use client"

import { useQuery } from '@tanstack/react-query'
import { fetchNodes } from '@/services/nodes'
import { useState } from 'react'
import { FilterBar, type FilterValue } from '@/components/shared/FilterBar'
import { NodeCard } from '@/components/cards/NodeCard'
import { useParams } from 'next/navigation'
import { PAGINATION } from '@/lib/constants'

export default function NodesPage() {
  const { locale } = useParams<{ locale: string }>()
  const [filter, setFilter] = useState<FilterValue>({})
  const [page, setPage] = useState(1)
  const baseId = ''
  const { data } = useQuery({ queryKey: ['nodes', baseId], queryFn: () => fetchNodes(baseId) })
  const list = (data || []).filter((n) => (filter.type ? n.type === filter.type : true))
  const start = (page - 1) * PAGINATION.pageSize
  const end = start + PAGINATION.pageSize
  const pageCount = Math.max(1, Math.ceil(list.length / PAGINATION.pageSize))
  return (
    <div className="container-responsive py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Nodes</h1>
      <FilterBar onChange={(v) => { setPage(1); setFilter(v) }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.slice(start, end).map((n: any) => (
          <NodeCard key={n.id} node={n} href={`/${locale}/nodes/${n.id}`} />
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

