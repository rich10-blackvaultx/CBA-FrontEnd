export type BookingType = 'cowork_day' | 'coliving' | 'combo'

export interface BookingRequest {
  nodeId?: string
  baseId?: string
  start: string // ISO date
  end: string // ISO date
  type: BookingType
  includeHousing?: boolean
  includeCowork?: boolean
  timezone?: string
  note?: string
}

export interface Booking extends BookingRequest {
  id: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'waitlist'
  price?: { amount: number; currency: 'USD' | 'EUR' | 'CNY' }
}

