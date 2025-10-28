export async function fetchEssentials(baseId: string) {
  const url = new URL('/api/essentials', location.origin)
  url.searchParams.set('baseId', baseId)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch essentials')
  return res.json()
}

