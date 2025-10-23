export interface Post {
  id: string
  title: string
  coverUrl?: string
  author: string
  createdAt: string
  updatedAt?: string
  avatar?: string
  tags: string[]
  excerpt: string
  content?: string
  rating?: number
}
