import { useFormContext } from 'react-hook-form'
import type { ActivityInput } from '@/types/activity'

export function HostStep() {
  const { register } = useFormContext<ActivityInput>()
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <label className="text-sm">
        <div>主持人/嘉宾</div>
        <input {...register('host')} className="w-full border rounded-md px-3 py-2" />
      </label>
      <label className="text-sm">
        <div>上传头像</div>
        <input {...register('hostAvatar')} placeholder="URL/base64" className="w-full border rounded-md px-3 py-2" />
      </label>
      <label className="text-sm md:col-span-2">
        <div>身份标签（逗号分隔）</div>
        <input {...register('identityTags' as any)} className="w-full border rounded-md px-3 py-2" />
      </label>
    </div>
  )
}

