import { CreateActivityForm } from '@/components/forms/CreateActivityForm'
import { useTranslations } from 'next-intl'

export default function CreateActivityPage() {
  // Using client translation inside server component is tricky; keep static title for now
  return (
    <div className="container-responsive py-6">
      <h1 className="text-2xl font-semibold mb-4">Create Activity</h1>
      <CreateActivityForm />
    </div>
  )
}
