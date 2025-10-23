import { useFormContext } from 'react-hook-form'
import type { ActivityInput } from '@/types/activity'

export function CoreStep() {
  const { register, formState: { errors } } = useFormContext<ActivityInput>()
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <label className="text-sm md:col-span-2">
        <div>活动名称</div>
        <input {...register('title')} className="w-full border rounded-md px-3 py-2" maxLength={30} />
        {errors.title && <p className="text-red-500 text-xs">{String(errors.title.message)}</p>}
      </label>
      <label className="text-sm md:col-span-2">
        <div>一句话亮点</div>
        <input {...register('tagline')} className="w-full border rounded-md px-3 py-2" maxLength={50} />
      </label>
      <label className="text-sm md:col-span-2">
        <div>描述说明</div>
        <textarea {...register('desc')} className="w-full border rounded-md px-3 py-2 h-28" maxLength={500} />
      </label>
      <label className="text-sm md:col-span-2">
        <div>标签（逗号分隔）</div>
        <input {...register('tags' as any)} placeholder="AI, Web3" className="w-full border rounded-md px-3 py-2" />
      </label>
    </div>
  )
}

