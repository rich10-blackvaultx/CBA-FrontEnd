import Link from 'next/link'
import type { Post } from '@/types/community'

export function PostCard({ post, href }: { post: Post; href: string }) {
  return (
    <Link href={href} className="card w-72 shrink-0 snap-start">
      {post.coverUrl && <img src={post.coverUrl} alt={post.title} className="cover-img" />}
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1">{post.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{post.author}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{post.excerpt}</p>
      </div>
    </Link>
  )
}

