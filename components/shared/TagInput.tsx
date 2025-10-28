"use client"

import React, { useState } from 'react'

export function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('')
  function add(tag: string) {
    const t = tag.trim()
    if (!t) return
    if (value.includes(t)) return
    onChange([...value, t])
    setInput('')
  }
  return (
    <div className="w-full border rounded-md px-2 py-1 bg-white dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-wrap gap-2">
        {value.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800">
            {v}
            <button onClick={() => onChange(value.filter((x) => x !== v))} className="text-gray-500 hover:text-gray-700">×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault(); add(input)
            }
          }}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1"
        />
      </div>
    </div>
  )
}

