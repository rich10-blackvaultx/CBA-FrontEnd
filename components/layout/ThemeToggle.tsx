"use client"

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light' : 'Switch to dark'}
      className="px-2 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800"
      title={isDark ? 'Light' : 'Dark'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

