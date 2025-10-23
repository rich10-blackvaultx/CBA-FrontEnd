"use client"

import type { TimelineItem } from '@/types/base'
import { useChecklistStore } from '@/stores/useChecklistStore'

export function VerifyTimeline({ items, baseSlug }: { items: TimelineItem[]; baseSlug: string }) {
  const toggle = useChecklistStore((s) => s.toggle)
  const isChecked = useChecklistStore((s) => s.isChecked)
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Timeline</h3>
      <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
        {items.map((it, idx) => (
          <li key={idx} className="mb-6 ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">
              {it.day}
            </span>
            <h4 className="font-medium">{it.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{it.desc}</p>
            {it.verify?.length ? (
              <ul className="space-y-1">
                {it.verify.map((v) => (
                  <li key={v} className="flex items-center gap-2 text-sm">
                    <input
                      id={`${idx}-${v}`}
                      type="checkbox"
                      checked={isChecked(baseSlug, v)}
                      onChange={() => toggle(baseSlug, v)}
                    />
                    <label htmlFor={`${idx}-${v}`}>{v}</label>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}

