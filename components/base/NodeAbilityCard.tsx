import type { NodeAbility } from '@/types/base'
import { Tag } from '@/components/shared/Tag'

export function NodeAbilityCard({ node, href }: { node: NodeAbility; href?: string }) {
  const content = (
    <div className="card w-full">
      <img src={node.coverUrl} alt={node.name} className="cover-img" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{node.name}</h3>
          <Tag>{node.type}</Tag>
        </div>
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{node.address}</div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Open: {node.openTime} • Rating {node.rating?.toFixed(1) ?? '-'} • {node.noiseLevel || 'normal'}
        </div>
        {node.amenities?.length ? (
          <div className="mt-2 flex gap-1 flex-wrap">
            {node.amenities.slice(0, 3).map((a) => (
              <Tag key={a}>{a}</Tag>
            ))}
            {node.amenities.length > 3 ? <Tag>+{node.amenities.length - 3}</Tag> : null}
          </div>
        ) : null}
      </div>
    </div>
  )
  if (href) return <a href={href} aria-label={node.name}>{content}</a>
  return content
}

