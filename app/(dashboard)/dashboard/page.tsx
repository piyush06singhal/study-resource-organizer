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
  CheckCircle2, Flame, Calendar, FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  try {
    // Fetch all dashboard data in parallel
    const [stats, activity, deadlines, streak, subjectProgress] = await Promise.all([
      getDashboardStats(),
      getRecentActivity(),
      getUpcomingDeadlines(),
      getStudyStreak(),
      getSubjectProgress()
    ])

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your study overview
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/subjects">
              <Button>
                <BookOpen className="h-4 w-4 mr-2" />
                View Subjects
              </Button>
            </Link>
            <Link href="/planner">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Plan Study
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.subjectsCount}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Topics Progress</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedTopics}/{stats.totalTopics}</p>
                <p className="text-xs text-gray-500">{stats.completionRate}% complete</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-100">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Deadlines</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingDeadlines}</p>
                <p className="text-xs text-gray-500">Upcoming</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Study Time</p>
                <p className="text-3xl font-bold text-gray-900">{Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m</p>
                <p className="text-xs text-gray-500">This week</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Start Card */}
        <Card className="p-8 border-2 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Start organizing your studies by creating your first subject
          </p>
          <div className="flex gap-4">
            <Link href="/subjects">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <BookOpen className="h-5 w-5 mr-2" />
                Create Subject
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                <FileText className="h-5 w-5 mr-2" />
                Add Resources
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="p-8">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error loading dashboard</h1>
          <p className="text-muted-foreground mb-4">
            There was an error loading your dashboard. This might be a temporary issue.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Link href="/subjects">
              <Button variant="outline">
                Go to Subjects
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }
}
