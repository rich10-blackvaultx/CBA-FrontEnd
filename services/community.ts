import type { Post } from '@/types/community'
import { getJSON } from './http'

export async function fetchPosts(): Promise<Post[]> {
  return getJSON('/api/community')
}

export async function fetchPost(id: string): Promise<Post> {
  return getJSON(`/api/community?id=${encodeURIComponent(id)}`)
}

