export const SITE_NAME = 'Glomia Life'
export const SUPPORTED_LOCALES = ['en', 'zh'] as const

export function truncateAddress(addr?: string) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export const PAGINATION = {
  pageSize: 8
}

