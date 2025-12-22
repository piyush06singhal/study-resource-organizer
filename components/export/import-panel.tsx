'use client'

import { useState } from 'react'
import { Upload, FileJson, FileSpreadsheet, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { importFromJSON, restoreBackup } from '@/lib/actions/export'
import { useRouter } from 'next/navigation'

export function ImportPanel() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'json' | 'backup') => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const text = await file.text()
      const importResult = type === 'backup' 
        ? await restoreBackup(text)
        : await importFromJSON(text)
      
      setResult(importResult)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Import failed. Please check the file format.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Import Data</h2>
        <p className="text-muted-foreground">Import data from various sources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <FileJson className="w-8 h-8 mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Import JSON</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Import data from JSON files or other apps
          </p>
          <div>
            <Label htmlFor="json-file">Select JSON File</Label>
            <Input
              id="json-file"
              type="file"
              accept=".json"
              onChange={(e) => handleFileUpload(e, 'json')}
              disabled={loading}
            />
          </div>
        </Card>

        <Card className="p-6">
          <Package className="w-8 h-8 mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Restore Backup</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Restore from a previous backup file
          </p>
          <div>
            <Label htmlFor="backup-file">Select Backup File</Label>
            <Input
              id="backup-file"
              type="file"
              accept=".json"
              onChange={(e) => handleFileUpload(e, 'backup')}
              disabled={loading}
            />
          </div>
        </Card>
      </div>

      {result && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Import Results</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Successfully imported:</span>
              <span className="font-semibold text-green-600">{result.success?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Failed:</span>
              <span className="font-semibold text-red-600">{result.failed?.length || 0}</span>
            </div>
          </div>
          {result.success?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Imported items:</p>
              <div className="space-y-1">
                {result.success.slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="text-sm text-muted-foreground">
                    • {item.type}: {item.name}
                  </div>
                ))}
                {result.success.length > 5 && (
                  <div className="text-sm text-muted-foreground">
                    ... and {result.success.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      <Card className="p-6 bg-secondary/50">
        <h3 className="font-semibold mb-2">Import from Other Apps</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Coming soon: Direct import from Notion, Evernote, and other popular apps
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <Upload className="w-4 h-4 mr-2" />
            Notion
          </Button>
          <Button variant="outline" disabled>
            <Upload className="w-4 h-4 mr-2" />
            Evernote
          </Button>
        </div>
      </Card>
    </div>
  )
}
