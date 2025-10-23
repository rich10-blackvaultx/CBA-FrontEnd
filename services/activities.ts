import type { Activity, ActivityInput } from '@/types/activity'
import { getJSON, postJSON } from './http'

export async function fetchActivities(): Promise<Activity[]> {
  return getJSON('/api/activities')
}

export async function createActivity(input: ActivityInput & { creatorAddress: string }) {
  return postJSON<Activity>(`/api/activities`, input)
}
