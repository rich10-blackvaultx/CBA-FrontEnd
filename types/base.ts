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

export interface BaseDetail extends BaseSummary {
  timeline: { day: number; title: string; desc: string; icon?: string }[]
  cost: CostBreakdown
  storyIds: string[]
  nodeIds: string[]
}

