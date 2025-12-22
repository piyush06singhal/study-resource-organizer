import { AdvancedSearch } from '@/components/search/advanced-search'

export default function SearchPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Advanced Search</h1>
        <p className="text-muted-foreground mt-2">
          Search across all your study materials with powerful filters
        </p>
      </div>

      <AdvancedSearch />
    </div>
  )
}
