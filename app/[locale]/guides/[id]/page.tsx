"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function GuideDetailPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>()
  const [post, setPost] = useState<any>(null)
  useEffect(() => {
    ;(async () => {
      const res = await fetch(`/api/community/${id}`)
      setPost(await res.json())
    })()
  }, [id])
  if (!post) return <div className="container-responsive py-6">Loading...</div>
  return (
    <div className="container-responsive py-6 space-y-4">
      <Link href={`/${locale}/bases`} className="text-brand">← Back</Link>
      <div className="card overflow-hidden">
        {post.coverUrl && <img src={post.coverUrl} className="w-full h-56 object-cover" />}
        <div className="p-4">
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <div className="text-sm text-gray-600 mt-1">{post.author} · {post.updatedAt}</div>
          <p className="mt-4 whitespace-pre-line">{post.content || post.excerpt}</p>
        </div>
      </div>
    </div>
  )
}

