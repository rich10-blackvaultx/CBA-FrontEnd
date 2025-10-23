"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UIState = {
  notImplemented: { open: boolean; feature?: string }
  openNI: (feature?: string) => void
  closeNI: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      notImplemented: { open: false },
      openNI: (feature) => set({ notImplemented: { open: true, feature } }),
      closeNI: () => set({ notImplemented: { open: false } })
    }),
    { name: 'ui-store' }
  )
)

