'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Square, Clock } from 'lucide-react'
import { startStudySession, endStudySession } from '@/lib/actions/sessions'
import { useRouter } from 'next/navigation'

interface SessionTimerProps {
  subjects?: Array<{ id: string; name: string; color: string }>
  topics?: Array<{ id: string; name: string; subject_id: string }>
  activeSession?: {
    id: string
    start_time: string
    subject_id?: string
    topic_id?: string
    subjects?: { name: string; color: string } | null
    topics?: { name: string } | null
  } | null
}

export function SessionTimer({ subjects = [], topics = [], activeSession }: SessionTimerProps) {
  const [isActive, setIsActive] = useState(!!activeSession)
  const [time, setTime] = useState(0)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (activeSession) {
      const startTime = new Date(activeSession.start_time).getTime()
      const now = Date.now()
      setTime(Math.floor((now - startTime) / 1000))
      setSelectedSubject(activeSession.subject_id || '')
      setSelectedTopic(activeSession.topic_id || '')
    }
  }, [activeSession])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const filteredTopics = selectedSubject
    ? topics.filter(t => t.subject_id === selectedSubject)
    : topics

  async function handleStart() {
    setIsLoading(true)
    const result = await startStudySession({
      subject_id: selectedSubject || undefined,
      topic_id: selectedTopic || undefined
    })
    
    if (result.success) {
      setIsActive(true)
      setTime(0)
      router.refresh()
    }
    setIsLoading(false)
  }

  async function handleStop() {
    if (!activeSession) return
    
    setIsLoading(true)
    const result = await endStudySession(activeSession.id, notes)
    
    if (result.success) {
      setIsActive(false)
      setTime(0)
      setNotes('')
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-8 text-center border-2">
        <div className="mb-8">
          <div className={`text-6xl md:text-8xl font-mono font-bold mb-4 ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}>
            {formatTime(time)}
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {isActive ? 'Session in progress' : 'Ready to start'}
            </span>
          </div>
        </div>

        {isActive && activeSession && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              {activeSession.subjects && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeSession.subjects.color }}
                />
              )}
              <span className="font-semibold">
                {activeSession.subjects?.name || 'General Study'}
              </span>
            </div>
            {activeSession.topics && (
              <p className="text-sm text-muted-foreground">
                {activeSession.topics.name}
              </p>
            )}
          </div>
        )}

        {!isActive && (
          <div className="mb-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value)
                  setSelectedTopic('')
                }}
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select Subject (Optional)</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={!selectedSubject}
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <option value="">Select Topic (Optional)</option>
                {filteredTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {isActive && (
          <div className="mb-6">
            <textarea
              placeholder="Session notes (optional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!isActive ? (
            <Button
              onClick={handleStart}
              disabled={isLoading}
              size="lg"
              className="h-14 px-8 text-lg"
            >
              <Play className="h-6 w-6 mr-2" />
              Start Session
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              disabled={isLoading}
              size="lg"
              variant="destructive"
              className="h-14 px-8 text-lg"
            >
              <Square className="h-6 w-6 mr-2" />
              End Session
            </Button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Regular study sessions help build consistency and track your progress
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
