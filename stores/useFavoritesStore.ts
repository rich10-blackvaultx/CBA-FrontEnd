"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoritesState = {
  bases: Record<string, boolean>
  nodes: Record<string, boolean>
  toggleBase: (id: string) => void
  toggleNode: (id: string) => void
  isBaseFav: (id: string) => boolean
  isNodeFav: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      bases: {},
      nodes: {},
      toggleBase: (id) => set((s) => ({ bases: { ...s.bases, [id]: !s.bases[id] } })),
      toggleNode: (id) => set((s) => ({ nodes: { ...s.nodes, [id]: !s.nodes[id] } })),
      isBaseFav: (id) => Boolean(get().bases[id]),
      isNodeFav: (id) => Boolean(get().nodes[id])
    }),
    { name: 'favorites-store' }
  )
)

