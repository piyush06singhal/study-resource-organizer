'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { updateProfile } from '@/lib/actions/profile'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NotificationSettingsProps {
  profile: any
}

export function NotificationSettings({ profile }: NotificationSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    deadlines: profile?.notification_preferences?.deadlines ?? true,
    revisions: profile?.notification_preferences?.revisions ?? true,
    achievements: profile?.notification_preferences?.achievements ?? true,
    reminders: profile?.notification_preferences?.reminders ?? true,
    email: profile?.notification_preferences?.email ?? false
  })
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await updateProfile({
      notification_preferences: preferences
    })
    
    if (result.success) {
      router.refresh()
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="deadlines">Deadline Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about upcoming deadlines
            </p>
          </div>
          <Switch
            id="deadlines"
            checked={preferences.deadlines}
            onCheckedChange={(checked) => setPreferences({ ...preferences, deadlines: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="revisions">Revision Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when it's time to revise topics
            </p>
          </div>
          <Switch
            id="revisions"
            checked={preferences.revisions}
            onCheckedChange={(checked) => setPreferences({ ...preferences, revisions: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="achievements">Achievement Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Celebrate your study milestones
            </p>
          </div>
          <Switch
            id="achievements"
            checked={preferences.achievements}
            onCheckedChange={(checked) => setPreferences({ ...preferences, achievements: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reminders">Study Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Daily reminders to maintain your study streak
            </p>
          </div>
          <Switch
            id="reminders"
            checked={preferences.reminders}
            onCheckedChange={(checked) => setPreferences({ ...preferences, reminders: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email (coming soon)
            </p>
          </div>
          <Switch
            id="email"
            checked={preferences.email}
            onCheckedChange={(checked) => setPreferences({ ...preferences, email: checked })}
            disabled
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Save Preferences
      </Button>
    </form>
  )
}
