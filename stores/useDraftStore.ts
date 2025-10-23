"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ActivityInput } from '@/types/activity'

type DraftState = {
  activity: Partial<ActivityInput>
  setDraft: (patch: Partial<ActivityInput>) => void
  clear: () => void
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      activity: {},
      setDraft: (patch) => set({ activity: { ...get().activity, ...patch } }),
      clear: () => set({ activity: {} })
    }),
    { name: 'draft-activity' }
  )
)

