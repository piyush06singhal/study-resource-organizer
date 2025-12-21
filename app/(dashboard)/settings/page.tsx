import { getProfile } from '@/lib/actions/profile'
import { ProfileForm } from '@/components/settings/profile-form'
import { PasswordForm } from '@/components/settings/password-form'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { DangerZone } from '@/components/settings/danger-zone'
import { Card } from '@/components/ui/card'
import { Settings as SettingsIcon } from 'lucide-react'

export default async function SettingsPage() {
  const profile = await getProfile()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
        <ProfileForm profile={profile} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <PasswordForm />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
        <NotificationSettings profile={profile} />
      </Card>

      <Card className="p-6 border-destructive">
        <h2 className="text-xl font-bold mb-4 text-destructive">Danger Zone</h2>
        <DangerZone />
      </Card>
    </div>
  )
}
