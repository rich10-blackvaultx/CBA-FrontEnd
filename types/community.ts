export interface Post {
  id: string
  title: string
  coverUrl?: string
  author: string
  createdAt: string
  tags: string[]
  excerpt: string
  content?: string
  rating?: number
}

