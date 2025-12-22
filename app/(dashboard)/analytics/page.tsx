import { 
  getStudyTimeHeatmap, 
  getSubjectTimeDistribution,
  getWeeklyStudyPattern,
  getProductivityTrends,
  getBestStudyTimes,
  getMonthlyComparison,
  getCompletionRateByTimeOfDay,
  getStudyStreak,
  getStudyRecommendations,
  getSubjectPerformance,
  getFocusScore,
  getUpcomingDeadlinesAnalytics
} from '@/lib/actions/analytics'
import { Card } from '@/components/ui/card'
import { BarChart3, TrendingUp, Clock, Calendar, Target, AlertCircle } from 'lucide-react'
import { HeatmapChart } from '@/components/analytics/heatmap-chart'
import { PieChart } from '@/components/analytics/pie-chart'
import { BarChart } from '@/components/analytics/bar-chart'
import { LineChart } from '@/components/analytics/line-chart'
import { StreakCard } from '@/components/analytics/streak-card'
import { SubjectPerformanceCard } from '@/components/analytics/subject-performance-card'
import { FocusScoreCard } from '@/components/analytics/focus-score-card'
import { RecommendationsCard } from '@/components/analytics/recommendations-card'
import { TimeOfDayHeatmap } from '@/components/analytics/time-of-day-heatmap'
import { ProductivityChart } from '@/components/analytics/productivity-chart'
import { Suspense } from 'react'
import Link from 'next/link'

function LoadingCard() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="h-64 bg-gray-200 rounded" />
    </Card>
  )
}

async function AnalyticsContent() {
  const [
    heatmapData,
    subjectDistribution,
    weeklyPattern,
    productivityTrends,
    bestTimes,
    monthlyData,
    completionRates,
    streak,
    recommendations,
    subjectPerformance,
    focusScore,
    upcomingDeadlines
  ] = await Promise.all([
    getStudyTimeHeatmap(),
    getSubjectTimeDistribution(),
    getWeeklyStudyPattern(),
    getProductivityTrends(),
    getBestStudyTimes(),
    getMonthlyComparison(),
    getCompletionRateByTimeOfDay(),
    getStudyStreak(),
    getStudyRecommendations(),
    getSubjectPerformance(),
    getFocusScore(),
    getUpcomingDeadlinesAnalytics()
  ])

  return (
    <>
      {/* Top Section: Streak, Focus Score, and Recommendations */}
      <div className="grid gap-6 md:grid-cols-3">
        <StreakCard
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
          totalDays={streak.totalDays}
        />
        <FocusScoreCard
          score={focusScore.score}
          totalStudyMinutes={focusScore.totalStudyMinutes}
          completedPlans={focusScore.completedPlans}
          totalPlans={focusScore.totalPlans}
          avgSessionLength={focusScore.avgSessionLength}
          sessionsCount={focusScore.sessionsCount}
        />
        <RecommendationsCard recommendations={recommendations} />
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Productivity Trend</p>
              <p className="text-2xl font-bold text-gray-900">
                {productivityTrends.changePercentage > 0 ? '+' : ''}
                {productivityTrends.changePercentage}%
              </p>
              <p className="text-xs text-gray-500">vs last 30 days</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Study Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(productivityTrends.currentPeriodMinutes / 60)}h
              </p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Best Study Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {bestTimes[0] ? `${bestTimes[0].hour}:00` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Most productive hour</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Days</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(heatmapData).length}
              </p>
              <p className="text-xs text-gray-500">Last 365 days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Study Time Heatmap */}
      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Study Time Heatmap
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Your study activity over the past year
        </p>
        <HeatmapChart data={heatmapData} />
      </Card>

      {/* Subject Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Subject Time Distribution
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Time spent on each subject (last 3 months)
          </p>
          <PieChart data={subjectDistribution} />
        </Card>

        <ProductivityChart
          currentPeriodMinutes={productivityTrends.currentPeriodMinutes}
          previousPeriodMinutes={productivityTrends.previousPeriodMinutes}
          changePercentage={productivityTrends.changePercentage}
          trend={productivityTrends.trend as 'up' | 'down' | 'stable'}
        />
      </div>

      {/* Weekly Pattern and Time of Day Heatmap */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Weekly Study Pattern
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Average study time by day of week
          </p>
          <BarChart data={weeklyPattern} />
        </Card>

        <TimeOfDayHeatmap data={weeklyPattern} />
      </div>

      {/* Monthly Comparison */}
      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Monthly Study Time Trend
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Your study time over the past 6 months
        </p>
        <LineChart data={monthlyData} />
      </Card>

      {/* Best Study Times */}
      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Your Most Productive Hours
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Based on completion rates and study duration
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {bestTimes.map((time, index) => (
            <Card key={time.hour} className="p-4 border-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-blue-600">
                  #{index + 1}
                </span>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xl font-semibold">
                {time.hour}:00 - {time.hour + 1}:00
              </p>
              <p className="text-sm text-gray-600">
                Avg: {Math.round(time.avgMinutes)} min/session
              </p>
              <p className="text-xs text-gray-500">
                {time.sessionCount} sessions
              </p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Completion Rate by Time */}
      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Completion Rate by Time of Day
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          When you're most likely to complete planned study sessions
        </p>
        <div className="space-y-2">
          {completionRates
            .sort((a, b) => b.completionRate - a.completionRate)
            .slice(0, 10)
            .map((rate) => (
              <div key={rate.hour} className="flex items-center gap-4">
                <span className="text-sm font-medium w-20">
                  {rate.hour}:00
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all"
                    style={{ width: `${rate.completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-16 text-right">
                  {Math.round(rate.completionRate)}%
                </span>
              </div>
            ))}
        </div>
      </Card>

      {/* Subject Performance */}
      <SubjectPerformanceCard subjects={subjectPerformance} />

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Upcoming Deadlines
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Stay on top of your assignments and exams
          </p>
          <div className="space-y-3">
            {upcomingDeadlines.slice(0, 5).map((deadline: any) => (
              <div
                key={deadline.id}
                className={`p-4 rounded-lg border-2 ${
                  deadline.daysUntil <= 3 ? 'border-red-200 bg-red-50' :
                  deadline.daysUntil <= 7 ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {deadline.subjects && (
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: deadline.subjects.color }}
                        />
                      )}
                      <h4 className="font-semibold text-gray-900">{deadline.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        deadline.priority === 'high' ? 'bg-red-100 text-red-700' :
                        deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {deadline.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {deadline.subjects?.name || 'General'} • {deadline.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      deadline.daysUntil <= 3 ? 'text-red-600' :
                      deadline.daysUntil <= 7 ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {deadline.daysUntil === 0 ? 'Today' :
                       deadline.daysUntil === 1 ? 'Tomorrow' :
                       `${deadline.daysUntil} days`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(deadline.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/deadlines"
            className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all deadlines →
          </Link>
        </Card>
      )}
    </>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Analytics & Insights
        </h1>
        <p className="text-muted-foreground mt-1">
          Understand your study patterns and optimize your learning
        </p>
      </div>

      <Suspense fallback={<LoadingCard />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  )
}
