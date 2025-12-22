import { 
  getDashboardStats, 
  getRecentActivity, 
  getUpcomingDeadlines,
  getStudyStreak,
  getSubjectProgress
} from '@/lib/actions/dashboard'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines'
import { SubjectProgress } from '@/components/dashboard/subject-progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, Target, TrendingUp, Clock, 
  CheckCircle2, Flame, Calendar, FileText,
  Brain, Sparkles, Zap, Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from 'react'

// Loading skeleton for stats
function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-6 border-2 bg-white animate-pulse">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-200 w-12 h-12" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// Stats component
async function DashboardStats() {
  const stats = await getDashboardStats()
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800/50 group cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Subjects</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats.subjectsCount}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800/50 group cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Topics Progress</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.completedTopics}/{stats.totalTopics}</p>
            <p className="text-xs text-gray-500">{stats.completionRate}% complete</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 border-orange-200 dark:border-orange-800/50 group cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg group-hover:scale-110 transition-transform">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deadlines</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stats.upcomingDeadlines}</p>
            <p className="text-xs text-gray-500">Upcoming</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800/50 group cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Time</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m</p>
            <p className="text-xs text-gray-500">This week</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Welcome back! Here's your study overview
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/subjects">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg">
              <BookOpen className="h-4 w-4 mr-2" />
              View Subjects
            </Button>
          </Link>
          <Link href="/planner">
            <Button variant="outline" className="border-2">
              <Calendar className="h-4 w-4 mr-2" />
              Plan Study
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid with Suspense */}
      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/ai-planner">
          <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-200 dark:border-indigo-800/50 cursor-pointer group">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">AI Planner</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Smart study plans</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/notes">
          <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800/50 cursor-pointer group">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Notes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rich markdown editor</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/flashcards">
          <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800/50 cursor-pointer group">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Flashcards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Spaced repetition</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/analytics">
          <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 border-orange-200 dark:border-orange-800/50 cursor-pointer group">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track progress</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Quick Start Card */}
      <Card className="p-8 border-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800/50 shadow-xl">
        <div className="flex items-start gap-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <Award className="h-12 w-12 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get Started with StudyFlow
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start organizing your studies by creating your first subject and unlock the power of AI-driven learning
            </p>
            <div className="flex gap-4">
              <Link href="/subjects">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Create Subject
                </Button>
              </Link>
              <Link href="/resources">
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                  <FileText className="h-5 w-5 mr-2" />
                  Add Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
