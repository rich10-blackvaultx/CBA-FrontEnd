export async function fetchAvailability(nodeId: string, at?: string) {
  const url = new URL('/api/availability', location.origin)
  url.searchParams.set('nodeId', nodeId)
  if (at) url.searchParams.set('at', at)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch availability')
  return res.json()
}

