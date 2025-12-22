'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signOut } from '@/lib/actions/auth'
import { NotificationBell } from './notification-bell'
import Link from 'next/link'

interface HeaderProps {
  user: {
    email: string
    full_name?: string
  }
}

export function Header({ user }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search subjects, topics, resources..."
            className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <NotificationBell />

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="gap-2 hover:bg-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
              {user.full_name?.[0] || user.email[0].toUpperCase()}
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700">
              {user.full_name || user.email.split('@')[0]}
            </span>
          </Button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <p className="font-semibold text-gray-900">{user.full_name || 'User'}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="p-2">
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                </div>
                <div className="p-2 border-t border-gray-200">
                  <form action={signOut}>
                    <Button
                      type="submit"
                      variant="ghost"
                      className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
