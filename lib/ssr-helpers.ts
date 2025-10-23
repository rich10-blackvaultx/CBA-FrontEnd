import { headers } from 'next/headers'

export async function getLocaleFromPath(pathname?: string): Promise<'en' | 'zh'> {
  const h = await headers()
  const p = pathname || (h.get('x-pathname') ?? '')
  if (p.startsWith('/zh')) return 'zh'
  return 'en'
}

export async function getAbsoluteUrl(path: string) {
  if (path.startsWith('http')) return path
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || 'http'
  return `${proto}://${host}${path.startsWith('/') ? '' : '/'}${path}`
}
