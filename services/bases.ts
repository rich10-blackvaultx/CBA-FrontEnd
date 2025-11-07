import type { BaseDetail, BaseSummary } from '@/types/base'
import { getJSON } from './http'

export async function fetchBases(filter?: string): Promise<BaseSummary[]> {
  const q = filter ? `?filter=${encodeURIComponent(filter)}` : ''
  try {
    const res = await getJSON<any>(`/api/bases${q}`)
    // Normalize remote or local shapes
    // - local: BaseSummary[]
    // - remote: { data: { items: BaseSummary[] } }
    return Array.isArray(res) ? res : (res?.data?.items ?? [])
  } catch {
    return []
  }
}

export async function fetchBaseDetail(slug: string): Promise<BaseDetail> {
  // Remote API uses path param: GET /api/bases/:id
  // We pass the current slug as the id segment.
  const res = await getJSON<any>(`/api/bases/${encodeURIComponent(slug)}`)
  return (res?.data as BaseDetail) || (res as BaseDetail)
}
