"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ChecklistState = {
  // baseSlug -> checked map (keyed by verify text)
  checked: Record<string, Record<string, boolean>>
  toggle: (baseSlug: string, key: string) => void
  isChecked: (baseSlug: string, key: string) => boolean
  reset: (baseSlug: string) => void
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set, get) => ({
      checked: {},
      toggle: (baseSlug, key) =>
        set((s) => ({
          checked: {
            ...s.checked,
            [baseSlug]: { ...(s.checked[baseSlug] || {}), [key]: !s.checked?.[baseSlug]?.[key] }
          }
        })),
      isChecked: (baseSlug, key) => Boolean(get().checked?.[baseSlug]?.[key]),
      reset: (baseSlug) => set((s) => ({ checked: { ...s.checked, [baseSlug]: {} } }))
    }),
    { name: 'checklist-store' }
  )
)

