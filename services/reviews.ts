import type { Review } from '@/types/review'

export async function fetchReviews(params: { nodeId?: string; baseId?: string }): Promise<Review[]> {
  const url = new URL('/api/reviews', location.origin)
  if (params.nodeId) url.searchParams.set('nodeId', params.nodeId)
  if (params.baseId) url.searchParams.set('baseId', params.baseId)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch reviews')
  return res.json()
}

export async function postReview(payload: { nodeId?: string; baseId?: string; author: string; rating: number; content: string }): Promise<Review> {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Failed to submit review')
  return res.json()
}

