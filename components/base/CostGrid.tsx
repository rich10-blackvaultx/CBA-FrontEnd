"use client"

import type { CostBreakdown } from '@/types/base'
import { useMemo, useState } from 'react'

const RATES: Record<'USD' | 'EUR' | 'CNY', number> = {
  USD: 1,
  EUR: 0.92,
  CNY: 7.1
}

export function CostGrid({ cost }: { cost: CostBreakdown }) {
  const [currency, setCurrency] = useState<keyof typeof RATES>(cost.currency)
  const factor = useMemo(() => RATES[currency] / RATES[cost.currency], [currency, cost.currency])
  const fmt = (v: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(v * factor)
  const total = cost.housing + cost.cowork + cost.food + cost.commute
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Costs</h3>
        <div className="text-sm flex items-center gap-2">
          <span>Currency</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="border rounded-md px-2 py-1 bg-white dark:bg-gray-900">
            {Object.keys(RATES).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-3">
          <p className="text-sm text-gray-500">Housing</p>
          <p className="font-semibold">{fmt(cost.housing)}</p>
        </div>
        <div className="card p-3">
          <p className="text-sm text-gray-500">Cowork</p>
          <p className="font-semibold">{fmt(cost.cowork)}</p>
        </div>
        <div className="card p-3">
          <p className="text-sm text-gray-500">Food</p>
          <p className="font-semibold">{fmt(cost.food)}</p>
        </div>
        <div className="card p-3">
          <p className="text-sm text-gray-500">Commute</p>
          <p className="font-semibold">{fmt(cost.commute)}</p>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">Total ≈ {fmt(total)} / mo</div>
    </div>
  )
}

