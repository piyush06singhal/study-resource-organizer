'use client'

import { useState } from 'react'
import { Upload, FileJson, Package, Sparkles, CheckCircle2, AlertCircle, FileUp, Cloud, Zap, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { importFromJSON, restoreBackup } from '@/lib/actions/export'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function ImportPanel() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent, type: 'json' | 'backup') => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      await processFile(file, type)
    }
  }

  const processFile = async (file: File, type: 'json' | 'backup') => {
    setLoading(true)
    setResult(null)
    try {
      const text = await file.text()
      const importResult = type === 'backup' 
        ? await restoreBackup(text)
        : await importFromJSON(text)
      
      setResult(importResult)
      router.refresh()
    } catch (error) {
      console.error(error)
      setResult({ error: 'Import failed. Please check the file format and try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'json' | 'backup') => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file, type)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Import Data</h2>
        <p className="text-gray-600 mt-1">Import data from various sources</p>
      </div>

      {/* Import Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, 'json')}
        >
          <Card className={`p-6 border-2 hover:shadow-2xl transition-all duration-300 bg-white border-purple-200 ${dragActive ? 'border-purple-500 bg-purple-50' : ''}`}>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 w-fit mb-4 shadow-lg">
              <FileJson className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Import JSON</h3>
            <p className="text-sm text-gray-600 mb-4">
              Import data from JSON files or other apps
            </p>
            
            <div className="mb-4 p-4 bg-purple-50 rounded-lg border-2 border-dashed border-purple-300 text-center">
              <FileUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium text-gray-900 mb-1">Drag & drop your file here</p>
              <p className="text-xs text-gray-600">or click below to browse</p>
            </div>

            <div>
              <Label htmlFor="json-file" className="text-sm font-medium text-gray-700">Select JSON File</Label>
              <Input
                id="json-file"
                type="file"
                accept=".json"
                onChange={(e) => handleFileUpload(e, 'json')}
                disabled={loading}
                className="mt-2 border-2 cursor-pointer"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, 'backup')}
        >
          <Card className={`p-6 border-2 hover:shadow-2xl transition-all duration-300 bg-white border-orange-200 ${dragActive ? 'border-orange-500 bg-orange-50' : ''}`}>
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 w-fit mb-4 shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Restore Backup</h3>
            <p className="text-sm text-gray-600 mb-4">
              Restore from a previous backup file
            </p>
            
            <div className="mb-4 p-4 bg-orange-50 rounded-lg border-2 border-dashed border-orange-300 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium text-gray-900 mb-1">Drag & drop your backup</p>
              <p className="text-xs text-gray-600">or click below to browse</p>
            </div>

            <div>
              <Label htmlFor="backup-file" className="text-sm font-medium text-gray-700">Select Backup File</Label>
              <Input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={(e) => handleFileUpload(e, 'backup')}
                disabled={loading}
                className="mt-2 border-2 cursor-pointer"
              />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-6 border-2 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
              <div>
                <p className="font-semibold text-gray-900">Processing your file...</p>
                <p className="text-sm text-gray-600">This may take a moment</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {result.error ? (
              <Card className="p-6 border-2 bg-red-50 border-red-200">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-red-100">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Import Failed</h3>
                    <p className="text-sm text-red-700">{result.error}</p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 border-2 bg-green-50 border-green-200">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-3">Import Successful!</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-white rounded-lg border border-green-200">
                        <p className="text-2xl font-bold text-green-600">{result.success?.length || 0}</p>
                        <p className="text-sm text-gray-600">Successfully imported</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-red-200">
                        <p className="text-2xl font-bold text-red-600">{result.failed?.length || 0}</p>
                        <p className="text-sm text-gray-600">Failed</p>
                      </div>
                    </div>
                    {result.success?.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Imported items:</p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {result.success.slice(0, 10).map((item: any, i: number) => (
                            <div key={i} className="text-sm text-gray-700 flex items-center gap-2 p-2 bg-white rounded border border-green-100">
                              <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                              <span className="font-medium">{item.type}:</span>
                              <span className="truncate">{item.name}</span>
                            </div>
                          ))}
                          {result.success.length > 10 && (
                            <div className="text-sm text-gray-600 p-2 bg-white rounded border border-green-100 text-center">
                              ... and {result.success.length - 10} more items
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coming Soon Section */}
      <Card className="p-6 border-2 bg-white border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
            <Cloud className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Import from Other Apps</h3>
            <p className="text-sm text-gray-600 mb-4">
              Coming soon: Direct import from popular note-taking and productivity apps
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" disabled className="border-2 opacity-60">
                <Upload className="w-4 h-4 mr-2" />
                Notion
              </Button>
              <Button variant="outline" disabled className="border-2 opacity-60">
                <Upload className="w-4 h-4 mr-2" />
                Evernote
              </Button>
              <Button variant="outline" disabled className="border-2 opacity-60">
                <Upload className="w-4 h-4 mr-2" />
                OneNote
              </Button>
              <Button variant="outline" disabled className="border-2 opacity-60">
                <Upload className="w-4 h-4 mr-2" />
                Google Keep
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Import Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border-2 bg-white border-blue-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">Quick Import</h4>
              <p className="text-xs text-gray-600">Drag and drop files directly onto the import cards for faster uploads</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-2 bg-white border-green-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">Data Safety</h4>
              <p className="text-xs text-gray-600">Your data is processed locally and never sent to external servers</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
