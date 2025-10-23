export type Climate = 'tropical' | 'temperate' | 'continental' | 'desert'

export interface CostBreakdown {
  housing: number
  cowork: number
  food: number
  commute: number
  currency: 'USD' | 'EUR' | 'CNY'
}

export interface BaseSummary {
  id: string
  slug: string
  name: string
  country: string
  coverUrl: string
  monthlyCost: number
  internetMbps: number
  visaLevel: 1 | 2 | 3 | 4 | 5
  climate: Climate
  safety: number
  communityScore: number
}

export interface TimelineItem { day: number; title: string; desc: string; verify?: string[] }
export interface BaseSignals {
  active30d: number
  residents30d: number
  topSkills: string[]
  faqs: { q: string; a: string }[]
}
export type NoiseLevel = 'quiet' | 'normal' | 'lively'
export interface NodeAbility {
  id: string
  name: string
  type: 'cafe' | 'cowork' | 'hack-node'
  address?: string
  openTime?: string
  rating?: number
  amenities?: string[]
  noiseLevel?: NoiseLevel
  seats?: number
  coverUrl?: string
}

export interface BaseDetail {
  id: string
  slug: string
  name: string
  country: string
  coverUrl: string
  summary: {
    monthlyCost: number
    currency: 'USD' | 'EUR' | 'CNY'
    internetMbps: number
    visaLevel: number
    safety: number
    community: number
    stayDays: number
    climate: Climate
  }
  cost: CostBreakdown
  signals: BaseSignals
  timeline: TimelineItem[]
  nodes: NodeAbility[]
  stories: { id: string; author: string; rating: number; updatedAt: string; avatar?: string; content: string }[]
}
