import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExportPanel } from '@/components/export/export-panel'
import { ImportPanel } from '@/components/export/import-panel'

export default function ExportPage() {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="export">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>
        <TabsContent value="export" className="mt-6">
          <ExportPanel />
        </TabsContent>
        <TabsContent value="import" className="mt-6">
          <ImportPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
