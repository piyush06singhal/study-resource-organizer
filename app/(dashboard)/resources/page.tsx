import { getResources, getAllTags } from '@/lib/actions/resources'
import { ResourceCard } from '@/components/resources/resource-card'
import { ResourceFilters } from '@/components/resources/resource-filters'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function ResourcesPage({
  searchParams
}: {
  searchParams: { type?: string; search?: string; tags?: string }
}) {
  const filters = {
    type: searchParams.type,
    search: searchParams.search,
    tags: searchParams.tags ? searchParams.tags.split(',') : undefined
  }

  const [resources, allTags] = await Promise.all([
    getResources(filters),
    getAllTags()
  ])

  const typeCount = {
    all: resources.length,
    note: resources.filter(r => r.type === 'note').length,
    pdf: resources.filter(r => r.type === 'pdf').length,
    image: resources.filter(r => r.type === 'image').length,
    link: resources.filter(r => r.type === 'link').length,
    video: resources.filter(r => r.type === 'video').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Resources
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your study materials and resources
          </p>
        </div>
        <Link href="/resources/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Resource
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border-2">
          <p className="text-sm font-medium text-muted-foreground">All</p>
          <p className="text-2xl font-bold">{typeCount.all}</p>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">📝 Notes</p>
          <p className="text-2xl font-bold">{typeCount.note}</p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">📄 PDFs</p>
          <p className="text-2xl font-bold">{typeCount.pdf}</p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">🖼️ Images</p>
          <p className="text-2xl font-bold">{typeCount.image}</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">🔗 Links</p>
          <p className="text-2xl font-bold">{typeCount.link}</p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">🎥 Videos</p>
          <p className="text-2xl font-bold">{typeCount.video}</p>
        </div>
      </div>

      {/* Filters */}
      <ResourceFilters allTags={allTags} currentFilters={filters} />

      {/* Resources Grid */}
      {resources.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} delay={index * 0.05} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex p-6 bg-primary/10 rounded-full mb-4">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {filters.search || filters.type !== 'all' || filters.tags
              ? 'No resources found'
              : 'No resources yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {filters.search || filters.type !== 'all' || filters.tags
              ? 'Try adjusting your filters'
              : 'Add your first resource to start building your library'}
          </p>
          <Link href="/resources/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Resource
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
