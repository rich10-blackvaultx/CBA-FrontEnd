import type { Booking, BookingRequest } from '@/types/booking'

export async function createBooking(payload: BookingRequest): Promise<Booking> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Failed to create booking')
  return res.json()
}

export async function fetchBookings(params: { nodeId?: string; baseId?: string }): Promise<Booking[]> {
  const url = new URL('/api/bookings', location.origin)
  if (params.nodeId) url.searchParams.set('nodeId', params.nodeId)
  if (params.baseId) url.searchParams.set('baseId', params.baseId)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch bookings')
  return res.json()
}

