"use client"

import Link from 'next/link'
import type { BaseSummary } from '@/types/base'
import { ArrowUpRight, Heart } from 'lucide-react'
import { useFavoritesStore } from '@/stores/useFavoritesStore'

export function BaseCard({
  base,
  href,
  ctaLabel = 'More',
  emphasized = false
}: {
  base: BaseSummary
  href: string
  ctaLabel?: string
  emphasized?: boolean
}) {
  const fav = useFavoritesStore((s) => !!s.bases[base.id])
  const toggleFav = useFavoritesStore((s) => s.toggleBase)
  const size = emphasized
    ? 'w-80 md:w-[22rem] h-[26rem] scale-100'
    : 'w-60 md:w-64 h-[22rem] scale-[0.92] hover:scale-100'
  return (
    <Link
      href={href}
      className={`relative overflow-hidden rounded-[24px] ${size} shrink-0 snap-start bg-gray-200 group transform-gpu transition-transform duration-300 ease-out`}
    >
      <img src={base.coverUrl} alt={base.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <button
        aria-label="favorite"
        onClick={(e) => {
          e.preventDefault()
          toggleFav(base.id)
        }}
        className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-soft hover:scale-105 transition-transform"
      >
        <Heart size={18} className={fav ? 'fill-red-500 text-red-500' : ''} />
      </button>

      <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
        <ArrowUpRight size={18} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 text-white drop-shadow">
        <div className="mb-2">
          <h3 className="text-xl font-semibold leading-tight">{base.name}</h3>
          <p className="text-sm opacity-90 -mt-0.5">{base.country}</p>
        </div>

        <p className="text-[13px] opacity-90">
          Budget ${base.monthlyCost}/m • Net {base.internetMbps} Mbps
        </p>

        {/* <div className="mt-4">
          <span className="inline-block rounded-full bg-brand px-5 py-2 text-sm text-white shadow-soft">
            {ctaLabel}
          </span>
        </div> */}
      </div>
    </Link>
  )
}
