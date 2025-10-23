import type { NodeItem } from '@/types/node'
import { getJSON } from './http'

export async function fetchNodes(baseId?: string): Promise<NodeItem[]> {
  const q = baseId ? `?baseId=${encodeURIComponent(baseId)}` : ''
  return getJSON(`/api/nodes${q}`)
}

export async function fetchNode(id: string): Promise<NodeItem> {
  return getJSON(`/api/nodes?id=${encodeURIComponent(id)}`)
}

