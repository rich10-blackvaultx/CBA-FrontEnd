import { CreateActivityForm } from '@/components/forms/CreateActivityForm'

export default function CreateActivityPage() {
  return (
    <div className="container-responsive py-6">
      <h1 className="text-2xl font-semibold mb-4">Create Activity</h1>
      <CreateActivityForm />
    </div>
  )
}

