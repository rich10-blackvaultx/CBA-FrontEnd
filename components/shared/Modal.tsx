"use client"

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ open, title, onClose, children, width = 640 }: { open: boolean; title?: React.ReactNode; onClose: () => void; children: React.ReactNode; width?: number }) {
  // Prevent background scroll when modal open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const node = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative shadow-xl rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-[92vw] max-w-[800px]" style={{ maxWidth: width }}>
        <div className="px-4 py-3 border-b dark:border-gray-800 flex items-center justify-between">
          <div className="font-semibold text-lg">{title}</div>
          <button onClick={onClose} className="px-2 py-1 rounded-md text-sm border dark:border-gray-700">×</button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
      </div>
    </div>
  )

  // Render to body to avoid header/stacking context issues across pages
  return typeof window !== 'undefined' ? createPortal(node, document.body) : node
}
