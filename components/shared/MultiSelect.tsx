"use client"

import React, { useMemo, useState } from 'react'

export function MultiSelect({ options, value, onChange, placeholder }: { options: string[]; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false)
  const selected = new Set(value.map((v) => v.toLowerCase()))
  const label = value.length ? value.join(', ') : (placeholder || '')
  const sorted = useMemo(() => options.slice().sort((a, b) => a.localeCompare(b)), [options])
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700 text-left">
        {label || '—'}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-64 overflow-auto rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 shadow">
          <div className="p-2 grid grid-cols-2 gap-1 text-sm">
            {sorted.map((opt) => {
              const k = opt.toLowerCase()
              const checked = selected.has(k)
              return (
                <label key={opt} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input type="checkbox" checked={checked} onChange={(e) => {
                    const next = new Set(selected)
                    if (e.target.checked) next.add(k)
                    else next.delete(k)
                    onChange(Array.from(next))
                  }} />
                  {opt}
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

