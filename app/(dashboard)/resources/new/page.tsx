import { ResourceForm } from '@/components/resources/resource-form'
import { getTopics } from '@/lib/actions/topics'

export default async function NewResourcePage() {
  const topics = await getTopics()

  return (
    <div className="max-w-4xl mx-auto">
      <ResourceForm topics={topics} />
    </div>
  )
}
