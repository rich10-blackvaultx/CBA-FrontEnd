"use client"

import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { ActivityInput } from '@/types/activity'

export function TimePlaceStep() {
  const { register, setValue, watch } = useFormContext<ActivityInput>()
  const baseId = watch('baseId')
  const [bases, setBases] = useState<any[]>([])
  const [nodes, setNodes] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/bases')
      setBases(await res.json())
    })()
  }, [])

  useEffect(() => {
    if (!baseId) return setNodes([])
    ;(async () => {
      const res = await fetch(`/api/nodes?baseId=${encodeURIComponent(baseId)}`)
      setNodes(await res.json())
    })()
  }, [baseId])

  const baseOptions = useMemo(() => bases.map((b) => ({ id: b.id, name: b.name })), [bases])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <label className="text-sm">
        <div>选择基地</div>
        <select {...register('baseId')} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700">
          <option value="">-</option>
          {baseOptions.map((b) => (
            <option value={b.id} key={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <div>选择节点</div>
        <select {...register('nodeId')} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700">
          <option value="">-</option>
          {nodes.map((n) => (
            <option value={n.id} key={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <div>开始时间</div>
        <input type="datetime-local" {...register('startAt')} className="w-full border rounded-md px-3 py-2" />
      </label>
      <label className="text-sm">
        <div>结束时间</div>
        <input type="datetime-local" {...register('endAt')} className="w-full border rounded-md px-3 py-2" />
      </label>
      <label className="text-sm">
        <div>时区</div>
        <input {...register('timezone')} placeholder="+08:00" className="w-full border rounded-md px-3 py-2" />
      </label>
      <label className="text-sm md:col-span-2">
        <div>地址补充</div>
        <input {...register('locationNote')} className="w-full border rounded-md px-3 py-2" />
      </label>
    </div>
  )
}

