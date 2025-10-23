"use client"

import { useFormContext } from 'react-hook-form'
import type { ActivityInput } from '@/types/activity'
import { useCallback } from 'react'

export function PosterStep() {
  const { register, setValue, watch } = useFormContext<ActivityInput>()
  const poster = watch('poster')

  const onFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = () => setValue('poster', String(reader.result))
    reader.readAsDataURL(file)
  }, [setValue])

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">16:9 推荐尺寸。可拖拽或从相册/相机上传。</div>
      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center bg-white/70 dark:bg-gray-900/60 dash-pulse">
        {poster ? (
          <img src={poster} alt="poster" className="mx-auto rounded-xl max-h-60" />
        ) : (
          <div className="text-gray-500 icon-pulse">＋</div>
        )}
        <div className="mt-3 flex items-center justify-center gap-2">
          <label className="px-3 py-2 rounded-md border cursor-pointer">
            从相册/相机上传
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onFile(f)
              }}
            />
          </label>
          <input {...register('poster')} placeholder="或粘贴图片 URL / base64" className="border rounded-md px-3 py-2 w-72" />
        </div>
      </div>
    </div>
  )
}
