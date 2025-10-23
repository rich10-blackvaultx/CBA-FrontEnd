"use client"

import { useUIStore } from '@/stores/useUIStore'

export function NotImplemented({ feature }: { feature?: string }) {
  const { notImplemented, closeNI } = useNI()
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" role="dialog" aria-modal>
      <div className="card p-6 w-[360px] text-center">
        <h3 className="text-lg font-semibold mb-2">{feature || 'Feature'}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">This feature is not available yet.</p>
        <button onClick={closeNI} className="px-4 py-2 rounded-md bg-brand text-white">
          OK
        </button>
      </div>
    </div>
  )
}

export function useNI() {
  const notImplemented = useUIStore((s) => s.notImplemented)
  const closeNI = useUIStore((s) => s.closeNI)
  return { notImplemented, closeNI }
}
