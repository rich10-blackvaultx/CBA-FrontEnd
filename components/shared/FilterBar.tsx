"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export type FilterValue = {
  budget?: number
  internet?: number
  visa?: number
  climate?: string
  community?: number
  type?: string
  seats?: number
  open?: string
}

export function FilterBar({
  onChange
}: {
  onChange: (val: FilterValue) => void
}) {
  const t = useTranslations('filters')
  const [val, setVal] = useState<FilterValue>({})

  function update(patch: Partial<FilterValue>) {
    const next = { ...val, ...patch }
    setVal(next)
    onChange(next)
  }

  return (
    <div className="card p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
      {/* Quick chips */}
      <div className="col-span-2 md:col-span-6 -mt-1 mb-1 flex flex-wrap gap-2 text-xs">
        <button
          className="px-2 py-1 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => {
            update({ budget: 1500 });
          }}
        >
          Budget {'<'} 1500
        </button>
        <button
          className="px-2 py-1 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => {
            update({ internet: 200 });
          }}
        >
          Net ≥ 200
        </button>
        <button
          className="px-2 py-1 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => {
            update({ visa: 1 as any });
          }}
        >
          Visa-easy
        </button>
      </div>
      <label className="text-sm">
        <span className="block mb-1">{t('budget')}</span>
        <input
          type="range"
          min={100}
          max={5000}
          step={50}
          onChange={(e) => update({ budget: Number(e.target.value) })}
          className="w-full"
        />
      </label>
      <label className="text-sm">
        <span className="block mb-1">{t('internet')}</span>
        <input
          type="range"
          min={10}
          max={1000}
          step={10}
          onChange={(e) => update({ internet: Number(e.target.value) })}
          className="w-full"
        />
      </label>
      <label className="text-sm">
        <span className="block mb-1">{t('visa')}</span>
        <select
          onChange={(e) => update({ visa: Number(e.target.value) })}
          className="w-full border rounded-md px-2 py-2 bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        >
          <option value="">-</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </label>
      <label className="text-sm">
        <span className="block mb-1">{t('climate')}</span>
        <select
          onChange={(e) => update({ climate: e.target.value })}
          className="w-full border rounded-md px-2 py-2 bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        >
          <option value="">-</option>
          <option value="tropical">tropical</option>
          <option value="temperate">temperate</option>
          <option value="continental">continental</option>
          <option value="desert">desert</option>
        </select>
      </label>
      <label className="text-sm">
        <span className="block mb-1">{t('community')}</span>
        <input type="range" min={0} max={100} step={5} onChange={(e) => update({ community: Number(e.target.value) })} className="w-full" />
      </label>
      <label className="text-sm">
        <span className="block mb-1">{t('type')}</span>
        <select
          onChange={(e) => update({ type: e.target.value })}
          className="w-full border rounded-md px-2 py-2 bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        >
          <option value="">-</option>
          <option value="cafe">cafe</option>
          <option value="cowork">cowork</option>
          <option value="hack-node">hack-node</option>
        </select>
      </label>
    </div>
  )
}
