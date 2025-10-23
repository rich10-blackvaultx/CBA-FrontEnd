"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavsState = {
  bases: Record<string, boolean>
  toggleBase: (id: string) => void
}

export const useFavoritesStore = create<FavsState>()(
  persist(
    (set, get) => ({
      bases: {},
      toggleBase: (id) =>
        set({ bases: { ...get().bases, [id]: !get().bases[id] } })
    }),
    { name: 'favorites-store' }
  )
)

