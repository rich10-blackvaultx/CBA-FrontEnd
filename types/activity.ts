export type Currency = 'USD' | 'EUR' | 'CNY'

export interface Ticket {
  type: 'free' | 'paid'
  price?: number
  currency?: Currency
  quota: number
  waitlist?: boolean
}

export interface ActivityInput {
  title: string
  tagline?: string
  desc?: string
  baseId: string
  nodeId?: string
  poster?: string
  startAt: string
  endAt: string
  timezone: string
  host?: string
  hostAvatar?: string
  identityTags?: string[]
  ticket: Ticket
  tags?: string[]
  locationNote?: string
}

export interface Activity extends ActivityInput {
  id: string
  status: 'pending' | 'published' | 'cancelled'
  creatorAddress: string
  createdAt: string
  signups: { address: string; status: 'confirmed' | 'waitlist' | 'checked-in' }[]
}
