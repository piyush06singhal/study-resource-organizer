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
          <Link href="/subjects/new">
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              New Subject
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
        <StatsCard
          title="Total Subjects"
          value={stats.subjectsCount}
          icon={BookOpen}
          description="Active subjects"
          color="from-blue-500 to-cyan-500"
          delay={0}
        />
        <StatsCard
          title="Topics Progress"
          value={`${stats.completedTopics}/${stats.totalTopics}`}
          icon={CheckCircle2}
          description={`${stats.completionRate}% completed`}
          color="from-green-500 to-emerald-500"
          delay={0.1}
        />
        <StatsCard
          title="Upcoming Deadlines"
          value={stats.upcomingDeadlines}
          icon={Target}
          description="Pending tasks"
          color="from-orange-500 to-red-500"
          delay={0.2}
        />
        <StatsCard
          title="Study Time (Week)"
          value={`${Math.floor(stats.totalStudyTime / 60)}h ${stats.totalStudyTime % 60}m`}
          icon={Clock}
          description="Total this week"
          color="from-purple-500 to-pink-500"
          delay={0.3}
        />
      </div>

      {/* Study Streak Card */}
      <Card className="border-2 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-5xl font-bold text-orange-500 mb-2">
                {streak.currentStreak}
              </div>
              <p className="text-sm text-muted-foreground">Current Streak (days)</p>
              <p className="text-xs text-muted-foreground mt-1">
                {streak.currentStreak > 0 ? 'Keep it up!' : 'Start studying today!'}
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-5xl font-bold text-blue-500 mb-2">
                {streak.longestStreak}
              </div>
              <p className="text-sm text-muted-foreground">Longest Streak (days)</p>
              <p className="text-xs text-muted-foreground mt-1">
                {streak.longestStreak > 0 ? 'Personal best!' : 'No streak yet'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <RecentActivity activity={activity} />

        {/* Upcoming Deadlines */}
        <UpcomingDeadlines deadlines={deadlines} />
      </div>

      {/* Subject Progress */}
      <SubjectProgress subjects={subjectProgress} />

      {/* Quick Actions */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/resources/new">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <BookOpen className="h-6 w-6" />
                <span>Add Resource</span>
              </Button>
            </Link>
            <Link href="/deadlines/new">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Target className="h-6 w-6" />
                <span>Add Deadline</span>
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
