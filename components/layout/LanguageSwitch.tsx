"use client"

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function LanguageSwitch() {
  const locale = useLocale()
  const pathname = usePathname() || '/'
  const to = locale === 'en' ? pathname.replace(/^\/en/, '/zh') : pathname.replace(/^\/zh/, '/en')
  return (
    <Link
      href={to}
      className="px-3 py-2 rounded-md border text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800"
    >
      {locale === 'en' ? '中文' : 'EN'}
    </Link>
  )
}
