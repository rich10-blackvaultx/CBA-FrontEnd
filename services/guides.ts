export async function fetchGuides(baseId: string) {
  const url = new URL('/api/guides', location.origin)
  url.searchParams.set('baseId', baseId)
  const res = await fetch(url.toString(), { next: { revalidate: 30 } })
  if (!res.ok) throw new Error('Failed to fetch guides')
  return res.json()
}

