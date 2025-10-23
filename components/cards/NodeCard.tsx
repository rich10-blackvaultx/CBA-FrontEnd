import Link from 'next/link'
import type { NodeItem } from '@/types/node'
import { Tag } from '@/components/shared/Tag'

export function NodeCard({ node, href }: { node: NodeItem; href: string }) {
  return (
    <Link href={href} className="card w-72 shrink-0 snap-start">
      <img src={node.coverUrl} alt={node.name} className="cover-img" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{node.name}</h3>
          <Tag>{node.type}</Tag>
        </div>
        <p className="text-sm text-gray-600 mt-1">{node.address}</p>
        <div className="text-xs text-gray-500 mt-2">Open: {node.openTime}</div>
      </div>
    </Link>
  )
}

