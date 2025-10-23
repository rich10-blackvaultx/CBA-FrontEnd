import type { BaseDetail, BaseSummary } from '@/types/base'
import { getJSON } from './http'

export async function fetchBases(filter?: string): Promise<BaseSummary[]> {
  const q = filter ? `?filter=${encodeURIComponent(filter)}` : ''
  return getJSON(`/api/bases${q}`)
}

export async function fetchBaseDetail(slug: string): Promise<BaseDetail> {
  return getJSON(`/api/bases?slug=${encodeURIComponent(slug)}`)
}

