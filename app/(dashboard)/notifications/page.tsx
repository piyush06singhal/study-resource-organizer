import { getNotifications, getUnreadCount } from '@/lib/actions/notifications'
import { NotificationsList } from '@/components/notifications/notifications-list'
import { Card } from '@/components/ui/card'
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react'

export default async function NotificationsPage() {
  const [notifications, unreadCount] = await Promise.all([
    getNotifications(),
    getUnreadCount()
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-blue-600" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your study progress and reminders
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="p-6 bg-white">
        <NotificationsList notifications={notifications} />
      </Card>
    </div>
  )
}
