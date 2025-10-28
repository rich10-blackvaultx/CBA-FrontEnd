"use client"

import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@/hooks/useI18n'

type Slide = { image: string; title?: string; subtitle?: string }

export function HomeHero({ slides, ctaHref }: { slides?: Slide[]; ctaHref?: string }) {
  const { t } = useI18n()
  const fallback: Slide[] = [
    { image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2000&auto=format&fit=crop' },
    { image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop' },
    { image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=2000&auto=format&fit=crop' }
  ]
  const items = useMemo(() => (slides?.length ? slides : fallback), [slides])
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (items.length <= 1) return
    const timer = setInterval(() => setIdx((v) => (v + 1) % items.length), 5000)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden rounded-none">
      {/* Slides */}
      {items.map((s, i) => (
        <img
          key={i}
          src={s.image}
          alt={s.title || 'hero'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {/* Small bottom veil */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(0,0,0,.35),rgba(0,0,0,.08))]" />

      {/* Content */}
      <div className="container-responsive relative z-10 h-full flex flex-col items-center justify-center text-center text-white select-none">
        <div className="uppercase tracking-[0.4em] text-xs md:text-sm opacity-80 mb-4">Glomia</div>
        <h1 className="font-bold leading-[1.05] text-4xl md:text-6xl lg:text-7xl max-w-5xl">
          {t('home.hero_title')}
        </h1>
        <p className="mt-4 md:mt-6 max-w-3xl text-sm md:text-base opacity-90">
          {t('home.hero_sub')}
        </p>
        {/* CTA */}
        <div className="mt-8">
          <a href={ctaHref || '#featured'} className="inline-flex items-center rounded-lg px-5 py-2.5 backdrop-blur-md bg-white/15 ring-1 ring-white/30 text-white hover:bg-white/25">
            Get Started
          </a>
        </div>

        {/* Left bottom card */}
        {items[idx]?.title ? (
          <div className="hidden md:block absolute left-8 bottom-8">
            <div className="backdrop-blur-xl rounded-2xl p-3 flex items-center gap-3 w-[280px] bg-black/25 ring-1 ring-white/20">
              <img src={items[idx].image} className="h-16 w-16 object-cover rounded-xl" alt="teaser" />
              <div className="text-left">
                <div className="text-sm font-medium text-white/95">{items[idx].title}</div>
                {items[idx].subtitle && <div className="text-xs text-white/80">{items[idx].subtitle}</div>}
              </div>
            </div>
          </div>
        ) : null}

        {/* Dots */}
        <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`slide-${i+1}`}
              onClick={() => setIdx(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${i===idx? 'bg-white':'bg-white/50 hover:bg-white/70'}`}
            />)
          )}
        </div>
      </div>
    </section>
  )
}
