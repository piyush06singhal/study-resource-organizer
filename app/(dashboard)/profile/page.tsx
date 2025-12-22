import { getProfile } from '@/lib/actions/profile'
import { getStudySessions } from '@/lib/actions/sessions'
import { getSubjects } from '@/lib/actions/subjects'
import { getDeadlines } from '@/lib/actions/deadlines'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, BookOpen, Target, Clock, Edit, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import Image from 'next/image'

export default async function ProfilePage() {
  const [profile, sessions, subjects, deadlines] = await Promise.all([
    getProfile(),
    getStudySessions(),
    getSubjects(),
    getDeadlines({})
  ])

  const totalStudyTime = sessions.reduce((acc: number, s: any) => acc + (s.duration_minutes || 0), 0)
  const completedDeadlines = deadlines.filter((d: any) => d.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            View your profile and study statistics
          </p>
        </div>
        <Link href="/settings">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Profile Card */}
      <Card className="p-8 bg-white">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile"
                width={160}
                height={160}
                className="rounded-full object-cover border-4 border-blue-100 shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200 shadow-lg">
                <User className="h-20 w-20 text-blue-600" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {profile?.full_name || 'Student'}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Joined {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'Recently'}</span>
              </div>
            </div>

            {profile?.bio && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}

            {profile?.study_goal && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Study Goal</p>
                  <p className="text-blue-700">{profile.study_goal}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Subjects</p>
              <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Deadlines</p>
              <p className="text-3xl font-bold text-gray-900">{completedDeadlines}/{deadlines.length}</p>
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
              <p className="text-3xl font-bold text-gray-900">
                {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{sessions.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Recent Activity</h2>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session: any) => (
              <div key={session.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {session.subjects?.name || 'General Study'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {session.duration_minutes} minutes • {format(new Date(session.start_time), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No study sessions yet</p>
        )}
      </Card>
    </div>
  )
}
