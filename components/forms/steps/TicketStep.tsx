import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import type { ActivityInput } from '@/types/activity'

export function TicketStep() {
  const { register, watch, setValue } = useFormContext<ActivityInput>()
  const type = watch('ticket.type') || 'free'
  useEffect(() => {
    if (!watch('ticket')) setValue('ticket', { type: 'free', quota: 10 } as any)
  }, [])
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <label className="text-sm">
        <div>票务</div>
        <select {...register('ticket.type' as any)} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700">
          <option value="free">免费</option>
          <option value="paid">付费</option>
        </select>
      </label>
      {type === 'paid' && (
        <>
          <label className="text-sm">
            <div>票价</div>
            <input type="number" step="0.01" {...register('ticket.price' as any)} className="w-full border rounded-md px-3 py-2" />
          </label>
          <label className="text-sm">
            <div>币种</div>
            <select {...register('ticket.currency' as any)} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CNY">CNY</option>
            </select>
          </label>
        </>
      )}
      <label className="text-sm">
        <div>名额</div>
        <input type="number" {...register('ticket.quota' as any, { valueAsNumber: true })} className="w-full border rounded-md px-3 py-2" />
      </label>
      <label className="text-sm col-span-2 flex items-center gap-2">
        <input type="checkbox" {...register('ticket.waitlist' as any)} /> 超额进入等候名单
      </label>
    </div>
  )
}

