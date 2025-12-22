'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm } from './profile-form'
import { PasswordForm } from './password-form'
import { NotificationSettings } from './notification-settings'
import { DangerZone } from './danger-zone'
import { User, Lock, Bell, AlertTriangle } from 'lucide-react'

interface SettingsTabsProps {
  profile: any
}

export function SettingsTabs({ profile }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-white border-2">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="danger" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="hidden sm:inline">Danger Zone</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <Card className="p-6 bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            <p className="text-gray-600 mt-1">Update your personal information and profile picture</p>
          </div>
          <ProfileForm profile={profile} />
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <Card className="p-6 bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
            <p className="text-gray-600 mt-1">Update your password to keep your account secure</p>
          </div>
          <PasswordForm />
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <Card className="p-6 bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
            <p className="text-gray-600 mt-1">Manage how you receive notifications</p>
          </div>
          <NotificationSettings profile={profile} />
        </Card>
      </TabsContent>

      <TabsContent value="danger" className="mt-6">
        <Card className="p-6 bg-white border-2 border-red-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>
            <p className="text-gray-600 mt-1">Irreversible actions that affect your account</p>
          </div>
          <DangerZone />
        </Card>
      </TabsContent>
    </Tabs>
  )
}
