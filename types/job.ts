export type PayType = 'fixed' | 'hourly' | 'milestone'

export interface Budget {
  min: number
  max: number
  currency: 'USD' | 'EUR' | 'CNY'
}

export interface Job {
  id: string
  title: string
  skills: string[]
  budget: Budget
  payType: PayType
  timezone: string
  reputationRequired?: number
  owner: { name: string }
}

export interface Bid {
  id: string
  jobId: string
  bidder: string
  message: string
  createdAt: string
}

