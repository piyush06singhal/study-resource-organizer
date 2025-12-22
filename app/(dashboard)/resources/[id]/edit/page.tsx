import { getResourceById } from '@/lib/actions/resources'
import { getTopics } from '@/lib/actions/topics'
import { ResourceForm } from '@/components/resources/resource-form'
import { notFound } from 'next/navigation'

export default async function EditResourcePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const [resource, topics] = await Promise.all([
    getResourceById(id),
    getTopics()
  ])

  if (!resource) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ResourceForm resource={resource as any} topics={topics} />
    </div>
  )
}
