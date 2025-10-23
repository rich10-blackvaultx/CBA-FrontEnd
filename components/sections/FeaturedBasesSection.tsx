"use client"

import Link from 'next/link'
import { useFavoritesStore } from '@/stores/useFavoritesStore'

type Item = {
  id: string
  slug: string
  name: string
  coverUrl: string
  monthlyCost: number
  internetMbps: number
}

export function FeaturedBasesSection({ bases, hrefBase }: { bases: Item[]; hrefBase: string }) {
  const toggle = useFavoritesStore((s) => s.toggleBase)
  const isFav = useFavoritesStore((s) => s.isBaseFav)

  return (
    <div className="overflow-x-auto snap-x snap-mandatory no-scrollbar">
      <div className="flex gap-4 w-max">
        {bases.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card w-72 h-48 animate-pulse" />
            ))
          : bases.map((b) => (
              <div key={b.id} className="relative w-72 shrink-0 snap-start">
                <button
                  aria-label="favorite"
                  className="absolute right-3 top-3 z-10 bg-black/40 text-white rounded-full w-8 h-8"
                  onClick={() => toggle(b.id)}
                >
                  {isFav(b.id) ? '♡' : '♥'}
                </button>
                <Link href={`${hrefBase}/bases/${b.slug}`} className="card block">
                  <img src={b.coverUrl} alt={b.name} className="cover-img aspect-[16/10]" />
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{b.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">${b.monthlyCost.toLocaleString()} / mo · {b.internetMbps} Mbps</p>
                    {/* <div className="mt-2 text-brand">More</div> */}
                  </div>
                </Link>
              </div>
            ))}
      </div>
    </div>
  )
}

