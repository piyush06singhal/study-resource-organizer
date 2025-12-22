import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExportPanel } from '@/components/export/export-panel'
import { ImportPanel } from '@/components/export/import-panel'
import { Download, Upload, Sparkles } from 'lucide-react'

export default function ExportPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Export & Import
        </h1>
        <p className="text-gray-600 mt-1 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Backup your data or import from other sources
        </p>
      </div>

      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-white border-2 shadow-sm">
          <TabsTrigger 
            value="export" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
          <TabsTrigger 
            value="import" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white font-semibold"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </TabsTrigger>
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
