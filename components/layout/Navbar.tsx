"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/hooks/useI18n'
import { LanguageSwitch } from './LanguageSwitch'
import { WalletButton } from './WalletButton'
import { useUIStore } from '@/stores/useUIStore'

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname?.startsWith(href)
  return (
    <Link href={href} className={`px-3 py-2 rounded-md ${active ? 'text-brand' : 'text-gray-700'}`}>
      {children}
    </Link>
  )
}

export function Navbar() {
  const { t, locale } = useI18n()
  const openNI = useUIStore((s) => s.openNI)
  const base = `/${locale}`
  return (
    <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-30">
      <div className="container-responsive flex items-center h-16 justify-between">
        <Link href={base} className="font-semibold text-xl">
          Glomia <span className="text-brand">Life</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href={`${base}/bases`}>{t('nav.bases')}</NavLink>
          <NavLink href={`${base}/nodes`}>{t('nav.nodes')}</NavLink>
          <NavLink href={`${base}/community`}>{t('nav.community')}</NavLink>
          <button onClick={() => openNI('Jobs')} className="px-3 py-2 text-gray-700">
            {t('nav.jobs')}
          </button>
          <NavLink href={`${base}/me`}>{t('nav.me')}</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <WalletButton />
        </div>
      </div>
    </header>
  )
}

