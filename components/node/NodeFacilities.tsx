"use client"

import { CheckCircle, Wifi, Printer, SquareGanttChart, Utensils, Dumbbell, MapPinned, Sofa } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'

const officeKeys = ['wifi', 'fast', 'printer', 'meeting rooms', '24/7', 'power']
const livingKeys = ['kitchen', 'sofa', 'leisure', 'gym', 'transport', 'view', 'outdoor']

function iconFor(tag: string) {
  const t = tag.toLowerCase()
  if (t.includes('wifi') || t.includes('fast')) return Wifi
  if (t.includes('printer')) return Printer
  if (t.includes('meeting')) return SquareGanttChart
  if (t.includes('kitchen')) return Utensils
  if (t.includes('gym')) return Dumbbell
  if (t.includes('transport')) return MapPinned
  if (t.includes('sofa') || t.includes('leisure') || t.includes('outdoor') || t.includes('view')) return Sofa
  return CheckCircle
}

export function NodeFacilities({ tags }: { tags?: string[] }) {
  const { t } = useI18n('nodeUI')
  const list = (tags || []).map((x) => String(x))
  const office = list.filter((t) => officeKeys.some((k) => t.toLowerCase().includes(k)))
  const living = list.filter((t) => livingKeys.some((k) => t.toLowerCase().includes(k)))
  if (!list.length) return null
  return (
    <div className="card p-4">
      <h4 className="font-semibold">{t('facilities.title')}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <div className="text-sm font-medium mb-2">{t('facilities.office')}</div>
          <div className="flex flex-wrap gap-2">
            {(office.length ? office : [t('facilities.fallback_office_1'), t('facilities.fallback_office_2')]).map((x) => {
              const Icon = iconFor(x)
              return (
                <span key={`o-${x}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800">
                  <Icon className="h-3.5 w-3.5" /> {x}
                </span>
              )
            })}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-2">{t('facilities.living')}</div>
          <div className="flex flex-wrap gap-2">
            {(living.length ? living : [t('facilities.fallback_living_1'), t('facilities.fallback_living_2')]).map((x) => {
              const Icon = iconFor(x)
              return (
                <span key={`l-${x}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800">
                  <Icon className="h-3.5 w-3.5" /> {x}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
