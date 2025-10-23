import { formatDateTime } from '@/lib/format'
import { getAbsoluteUrl } from '@/lib/ssr-helpers'

async function fetchPost(id: string) {
  const url = await getAbsoluteUrl(`/api/community?id=${id}`)
  const res = await fetch(url, {
    next: { revalidate: 60 }
  })
  return res.json()
}

export default async function PostDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params
  const post = await fetchPost(id)
  return (
    <div className="container-responsive py-6">
      <article className="prose max-w-none">
        <h1>{post.title}</h1>
        <p className="text-sm text-gray-500">{post.author} • {formatDateTime(post.createdAt)}</p>
        {post.coverUrl && <img src={post.coverUrl} alt="cover" className="rounded-xl my-4" />}
        <p>{post.content || post.excerpt}</p>
      </article>
      <div className="card p-4 mt-6">
        <h4 className="font-semibold">Comments</h4>
        <p className="text-gray-600 text-sm">Comment placeholder.</p>
      </div>
    </div>
  )
}
