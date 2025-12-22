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
  CheckCircle2, Flame, Calendar
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
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Subjects</p>
                <p className="text-2xl font-bold">{stats.subjectsCount}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Topics Progress</p>
                <p className="text-2xl font-bold">{stats.completedTopics}/{stats.totalTopics}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
                <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deadlines</p>
                <p className="text-2xl font-bold">{stats.upcomingDeadlines}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="text-2xl font-bold">{Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Start Card */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="text-muted-foreground mb-6">
            Start organizing your studies by creating your first subject
          </p>
          <div className="flex gap-4">
            <Link href="/subjects">
              <Button size="lg">
                <BookOpen className="h-5 w-5 mr-2" />
                Create Subject
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline">
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
