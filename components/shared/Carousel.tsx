"use client"

import { ReactNode, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Carousel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  function scrollByX(delta: number) {
    ref.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }
  return (
    <div className="relative fade-edge-x group">
      <button
        aria-label="scroll-left"
        onClick={() => scrollByX(-300)}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-soft items-center justify-center z-10 opacity-100 transition"
      >
        <ChevronLeft size={18} />
      </button>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>
      <button
        aria-label="scroll-right"
        onClick={() => scrollByX(300)}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-soft items-center justify-center z-10 opacity-100 transition"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
