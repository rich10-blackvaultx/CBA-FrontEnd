export interface ActivityInput {
  title: string
  intro: string
  nodeId: string
  baseId?: string
  quota: number
  startAt: string
  endAt: string
  price?: number
  poster?: string
}

export interface Activity extends ActivityInput {
  id: string
  creator: string
}

