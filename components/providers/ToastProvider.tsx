"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Toast = { id: string; message: string; type?: 'success' | 'error' | 'info' }
type ToastContext = { show: (message: string, type?: Toast['type']) => void }

const Ctx = createContext<ToastContext | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([])

  const show = useCallback<ToastContext['show']>((message, type) => {
    const t: Toast = { id: Math.random().toString(36).slice(2), message, type }
    setList((s) => [...s, t])
    // auto dismiss
    setTimeout(() => setList((s) => s.filter((x) => x.id !== t.id)), 2600)
  }, [])

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {typeof window !== 'undefined'
        ? createPortal(
            <div className="fixed top-3 right-3 z-[200] space-y-2">
              {list.map((t) => (
                <div
                  key={t.id}
                  className={
                    `min-w-[220px] max-w-[360px] rounded-lg shadow-lg px-3 py-2 text-sm border ` +
                    (t.type === 'error'
                      ? 'bg-red-600 text-white border-red-700'
                      : t.type === 'success'
                      ? 'bg-brand text-white border-white/10'
                      : 'bg-gray-900 text-white border-gray-800')
                  }
                >
                  {t.message}
                </div>
              ))}
            </div>,
            document.body
          )
        : null}
    </Ctx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(Ctx)
  return ctx || { show: () => {} }
}

