"use client"

import { ReactNode, useRef } from 'react'

export function Carousel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="relative fade-edge-x">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto overflow-y-visible py-2 snap-x snap-mandatory"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>
    </div>
  )
}
