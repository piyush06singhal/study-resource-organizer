'use client'

import { useState } from 'react'
import { Download, FileText, Database, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { exportToCSV, exportToJSON, createBackup } from '@/lib/actions/export'

export function ExportPanel() {
  const [loading, setLoading] = useState(false)
  const [exportType, setExportType] = useState<'subjects' | 'topics' | 'resources' | 'deadlines' | 'sessions'>('subjects')

  const handleCSVExport = async () => {
    setLoading(true)
    try {
      const { data, fileName } = await exportToCSV(exportType)
      const blob = new Blob([data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleJSONExport = async () => {
    setLoading(true)
    try {
      const data = await exportToJSON(false)
      const blob = new Blob([data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'study_data.json'
      a.click()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackup = async () => {
    setLoading(true)
    try {
      const { data, fileName } = await createBackup()
      const blob = new Blob([data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Export Data</h2>
        <p className="text-muted-foreground">Export your study data in various formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <FileText className="w-8 h-8 mb-4 text-primary" />
          <h3 className="font-semibold mb-2">CSV Export</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Export specific data types for analysis in Excel or other tools
          </p>
          <Select value={exportType} onValueChange={(v: any) => setExportType(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subjects">Subjects</SelectItem>
              <SelectItem value="topics">Topics</SelectItem>
              <SelectItem value="resources">Resources</SelectItem>
              <SelectItem value="deadlines">Deadlines</SelectItem>
              <SelectItem value="sessions">Study Sessions</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCSVExport} disabled={loading} className="w-full mt-4">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </Card>

        <Card className="p-6">
          <Database className="w-8 h-8 mb-4 text-primary" />
          <h3 className="font-semibold mb-2">JSON Export</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Export all your data in JSON format for portability
          </p>
          <Button onClick={handleJSONExport} disabled={loading} className="w-full mt-auto">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </Card>

        <Card className="p-6">
          <Package className="w-8 h-8 mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Full Backup</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a complete backup including all data and settings
          </p>
          <Button onClick={handleBackup} disabled={loading} className="w-full mt-auto">
            <Download className="w-4 h-4 mr-2" />
            Create Backup
          </Button>
        </Card>
      </div>
    </div>
  )
}
