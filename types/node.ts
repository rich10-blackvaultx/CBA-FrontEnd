export type NodeType = 'cafe' | 'cowork' | 'hack-node'

export interface NodeItem {
  id: string
  baseId: string
  name: string
  type: NodeType
  coverUrl: string
  geo: { lat: number; lng: number }
  address?: string
  openTime: string
  seats?: number
  tags?: string[]
  eventIds?: string[]
}

