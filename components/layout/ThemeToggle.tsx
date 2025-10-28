"use client"

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export function ThemeToggle({ variant = 'default' }: { variant?: 'default' | 'ghost' }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light' : 'Switch to dark'}
      className={variant==='ghost' ? 'h-9 px-3 rounded-md text-white/90 hover:text-white text-sm flex items-center' : 'h-9 px-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 text-sm flex items-center'}
      title={isDark ? 'Light' : 'Dark'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
