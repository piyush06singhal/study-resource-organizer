'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { markAsRead, markAllAsRead, deleteNotification } from '@/lib/actions/notifications'
import { Bell, CheckCircle2, Trash2, Target, RotateCcw, Trophy, Clock, Info } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
  related_id?: string
  related_type?: string
}

interface NotificationsListProps {
  notifications: Notification[]
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Target className="h-5 w-5 text-orange-600" />
      case 'revision':
        return <RotateCcw className="h-5 w-5 text-blue-600" />
      case 'achievement':
        return <Trophy className="h-5 w-5 text-yellow-600" />
      case 'reminder':
        return <Clock className="h-5 w-5 text-purple-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'bg-orange-50 border-orange-200'
      case 'revision':
        return 'bg-blue-50 border-blue-200'
      case 'achievement':
        return 'bg-yellow-50 border-yellow-200'
      case 'reminder':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  async function handleMarkAsRead(id: string) {
    setLoading(id)
    await markAsRead(id)
    router.refresh()
    setLoading(null)
  }

  async function handleMarkAllAsRead() {
    setLoading('all')
    await markAllAsRead()
    router.refresh()
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this notification?')) return
    setLoading(id)
    await deleteNotification(id)
    router.refresh()
    setLoading(null)
  }

  const unreadNotifications = notifications.filter(n => !n.is_read)

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">All Notifications</h2>
        {unreadNotifications.length > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={loading === 'all'}
            variant="outline"
            size="sm"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 border-2 transition-all ${
                notification.is_read ? 'bg-white' : getTypeColor(notification.type)
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${notification.is_read ? 'bg-gray-100' : 'bg-white'}`}>
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-1 ${notification.is_read ? 'text-gray-600' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{format(new Date(notification.created_at), 'MMM dd, yyyy h:mm a')}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <Button
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={loading === notification.id}
                          variant="ghost"
                          size="sm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(notification.id)}
                        disabled={loading === notification.id}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex p-6 bg-gray-50 rounded-full mb-4">
            <Bell className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">No notifications yet</h3>
          <p className="text-gray-600">You'll see notifications here when you have updates</p>
        </div>
      )}
    </div>
  )
}
