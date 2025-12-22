'use client'

import { useState } from 'react'
import { Download, FileText, Database, Package, Sparkles, CheckCircle2, Calendar, TrendingUp, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { exportToCSV, exportToJSON, createBackup } from '@/lib/actions/export'
import { motion } from 'framer-motion'

export function ExportPanel() {
  const [loading, setLoading] = useState(false)
  const [exportType, setExportType] = useState<'subjects' | 'topics' | 'resources' | 'deadlines' | 'sessions'>('subjects')
  const [lastExport, setLastExport] = useState<{ type: string; time: Date } | null>(null)

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
      setLastExport({ type: 'CSV', time: new Date() })
    } catch (error) {
      console.error(error)
      alert('Export failed. Please try again.')
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
      setLastExport({ type: 'JSON', time: new Date() })
    } catch (error) {
      console.error(error)
      alert('Export failed. Please try again.')
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
      setLastExport({ type: 'Backup', time: new Date() })
    } catch (error) {
      console.error(error)
      alert('Backup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportStats = [
    { label: 'CSV Files', value: '5+', icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Data Types', value: '5', icon: Database, color: 'from-purple-500 to-pink-500' },
    { label: 'Formats', value: '3', icon: Package, color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Export Data</h2>
          <p className="text-gray-600 mt-1">Export your study data in various formats</p>
        </div>
        {lastExport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg"
          >
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div className="text-sm">
              <p className="font-semibold text-green-900">{lastExport.type} exported</p>
              <p className="text-green-600 text-xs">{lastExport.time.toLocaleTimeString()}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 border-2 bg-white hover:shadow-lg transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border-2 hover:shadow-2xl transition-all duration-300 bg-white border-blue-200 group">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">CSV Export</h3>
            <p className="text-sm text-gray-600 mb-4">
              Export specific data types for analysis in Excel or other tools
            </p>
            <Select value={exportType} onValueChange={(v: any) => setExportType(v)}>
              <SelectTrigger className="mb-3 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="subjects">📚 Subjects</SelectItem>
                <SelectItem value="topics">📖 Topics</SelectItem>
                <SelectItem value="resources">📁 Resources</SelectItem>
                <SelectItem value="deadlines">⏰ Deadlines</SelectItem>
                <SelectItem value="sessions">⏱️ Study Sessions</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCSVExport} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md">
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Exporting...' : 'Export CSV'}
            </Button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border-2 hover:shadow-2xl transition-all duration-300 bg-white border-purple-200 group">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">JSON Export</h3>
            <p className="text-sm text-gray-600 mb-4">
              Export all your data in JSON format for portability
            </p>
            <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-gray-700 font-medium">✓ All subjects & topics</p>
              <p className="text-xs text-gray-700 font-medium">✓ Resources & notes</p>
              <p className="text-xs text-gray-700 font-medium">✓ Study sessions</p>
            </div>
            <Button onClick={handleJSONExport} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md">
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Exporting...' : 'Export JSON'}
            </Button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 border-2 hover:shadow-2xl transition-all duration-300 bg-white border-orange-200 group">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Full Backup</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create a complete backup including all data and settings
            </p>
            <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-700 font-medium">✓ Complete data backup</p>
              <p className="text-xs text-gray-700 font-medium">✓ User preferences</p>
              <p className="text-xs text-gray-700 font-medium">✓ Easy restoration</p>
            </div>
            <Button onClick={handleBackup} disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-md">
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Backup'}
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Export Schedule Recommendation */}
      <Card className="p-6 border-2 bg-white border-blue-200 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Recommended Backup Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <p className="font-semibold text-sm text-gray-900">Daily</p>
                </div>
                <p className="text-xs text-gray-600">Quick JSON export for recent changes</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <p className="font-semibold text-sm text-gray-900">Weekly</p>
                </div>
                <p className="text-xs text-gray-600">Full backup of all your data</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-orange-600" />
                  <p className="font-semibold text-sm text-gray-900">Monthly</p>
                </div>
                <p className="text-xs text-gray-600">Archive backup for long-term storage</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 border-2 bg-white border-green-200">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Export Tips & Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>CSV exports</strong> are perfect for data analysis in Excel, Google Sheets, or other spreadsheet tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>JSON exports</strong> preserve all data relationships and can be imported back into StudyFlow</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Full backups</strong> include everything - ideal for migrating to a new device or archiving</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Regular backups</strong> protect your study data from accidental loss or device failure</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
