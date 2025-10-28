export async function fetchRecommendations(params: { skills?: string[]; interests?: string[]; baseId?: string }) {
  const url = new URL('/api/recommend', location.origin)
  if (params.skills?.length) url.searchParams.set('skills', params.skills.join(','))
  if (params.interests?.length) url.searchParams.set('interests', params.interests.join(','))
  if (params.baseId) url.searchParams.set('baseId', params.baseId)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch recommendations')
  return res.json()
}

