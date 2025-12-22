import { getResources, getAllTags } from '@/lib/actions/resources'
import { ResourceCard } from '@/components/resources/resource-card'
import { ResourceFilters } from '@/components/resources/resource-filters'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, FileText, File, Image, Link as LinkIcon, Video, List } from 'lucide-react'
import Link from 'next/link'

export default async function ResourcesPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string; search?: string; tags?: string }>
}) {
  const params = await searchParams
  const filters = {
    type: params.type,
    search: params.search,
    tags: params.tags ? params.tags.split(',') : undefined
  }

  const [resources, allTags] = await Promise.all([
    getResources(filters),
    getAllTags()
  ])

  const typeCount = {
    all: resources.length,
    note: resources.filter((r: any) => r.type === 'note').length,
    pdf: resources.filter((r: any) => r.type === 'pdf').length,
    image: resources.filter((r: any) => r.type === 'image').length,
    link: resources.filter((r: any) => r.type === 'link').length,
    video: resources.filter((r: any) => r.type === 'video').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Resources
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your study materials and resources
          </p>
        </div>
        <Link href="/resources/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-5 w-5 mr-2" />
            Add Resource
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-100">
              <List className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">All</p>
              <p className="text-2xl font-bold text-gray-900">{typeCount.all}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-100">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Notes</p>
              <p className="text-2xl font-bold text-gray-900">{typeCount.note}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100">
              <File className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">PDFs</p>
              <p className="text-2xl font-bold text-gray-900">{typeCount.pdf}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Image className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Images</p>
              <p className="text-2xl font-bold text-gray-900">{typeCount.image}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <LinkIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Links</p>
              <p className="text-2xl font-bold text-gray-900">{typeCount.link}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Video className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Videos</p>
              <p className="text-2xl font-bold text-gray-900">{typeCount.video}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <ResourceFilters allTags={allTags} currentFilters={filters} />

      {/* Resources Grid */}
      {resources.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource: any, index: number) => (
            <ResourceCard key={resource.id} resource={resource} delay={index * 0.05} />
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center bg-white">
          <div className="inline-flex p-6 bg-blue-50 rounded-full mb-4">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            {filters.search || filters.type !== 'all' || filters.tags
              ? 'No resources found'
              : 'No resources yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.type !== 'all' || filters.tags
              ? 'Try adjusting your filters'
              : 'Add your first resource to start building your library'}
          </p>
          <Link href="/resources/new">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Resource
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
