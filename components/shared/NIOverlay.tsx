"use client"

import { NotImplemented, useNI } from './NotImplemented'

export function NIOverlay() {
  const { notImplemented } = useNI()
  if (!notImplemented.open) return null
  return <NotImplemented feature={notImplemented.feature} />
}

