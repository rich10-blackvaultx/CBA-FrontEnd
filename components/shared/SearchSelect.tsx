"use client"

import React, { useMemo, useState } from 'react'

export function SearchSelect({ options, value, onChange, placeholder }: { options: string[]; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const filtered = useMemo(() => options.filter((o) => o.toLowerCase().includes(q.toLowerCase())), [q, options])
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700 text-left">
        {value || placeholder || '—'}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 shadow">
          <div className="p-2 border-b dark:border-gray-800">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full px-2 py-1 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 text-sm" />
          </div>
          <div className="max-h-64 overflow-auto text-sm">
            {filtered.map((opt) => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false) }} className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

