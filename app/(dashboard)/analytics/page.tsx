'use client'

import { useEffect, useState } from 'react'
import { getAnalyticsData } from '@/lib/actions/analytics'
import { Card } from '@/components/ui/card'
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalyticsData().then(data => {
      setAnalytics(data)
      setLoading(false)
    })
  }, [])

  if (loading || !analytics) {
    return <div className="flex items-center justify-center h-96">Loading analytics...</div>
  }

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Insights into your study patterns and progress
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Total Study Time</span>
          </div>
          <p className="text-2xl font-bold">
            {formatDuration(analytics.subjectTimeData.reduce((acc: number, s: any) => acc + s.minutes, 0))}
          </p>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Study Streak</span>
          </div>
          <p className="text-2xl font-bold">
            {analytics.dailyConsistency.slice(-7).filter((d: any) => d.studied).length}
          </p>
          <p className="text-xs text-muted-foreground">Days this week</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Completion Rate</span>
          </div>
          <p className="text-2xl font-bold">
            {analytics.completionData.length > 0 
              ? Math.round(
                  (analytics.completionData.reduce((acc: number, s: any) => acc + s.completed, 0) /
                   analytics.completionData.reduce((acc: number, s: any) => acc + s.total, 0)) * 100
                )
              : 0}%
          </p>
          <p className="text-xs text-muted-foreground">Topics completed</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Deadline Adherence</span>
          </div>
          <p className="text-2xl font-bold">{analytics.deadlineStats.adherenceRate}%</p>
          <p className="text-xs text-muted-foreground">
            {analytics.deadlineStats.completedOnTime}/{analytics.deadlineStats.total} on time
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Weekly Study Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value: number) => [`${value}h`, 'Hours']}
                />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Time by Subject</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.subjectTimeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="minutes"
                  label={({ name, minutes }: any) => `${name}: ${formatDuration(minutes)}`}
                >
                  {analytics.subjectTimeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatDuration(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Daily Study Consistency</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.dailyConsistency}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value: number) => [formatDuration(value), 'Study Time']}
                />
                <Line 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Topic Completion by Subject</h2>
          <div className="space-y-4">
            {analytics.completionData.slice(0, 6).map((subject: any, index: number) => {
              const completionRate = subject.total > 0 ? (subject.completed / subject.total) * 100 : 0
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-muted-foreground">
                      {subject.completed}/{subject.total} ({Math.round(completionRate)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {analytics.completionData.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No topics yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
