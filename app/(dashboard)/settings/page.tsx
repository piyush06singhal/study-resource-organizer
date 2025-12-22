import { getProfile } from '@/lib/actions/profile'
import { SettingsTabs } from '@/components/settings/settings-tabs'
import { Settings as SettingsIcon } from 'lucide-react'

export default async function SettingsPage() {
  const profile = await getProfile()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabbed Settings */}
      <SettingsTabs profile={profile} />
    </div>
  )
}
