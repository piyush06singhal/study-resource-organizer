'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, LayoutDashboard, FolderOpen, FileText, 
  Calendar, Target, RotateCcw, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut, Clock, CreditCard,
  Search, Download
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions/auth'

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FolderOpen, label: 'Subjects', href: '/subjects' },
    { icon: BookOpen, label: 'Topics', href: '/topics' },
    { icon: FileText, label: 'Resources', href: '/resources' },
    { icon: Calendar, label: 'Planner', href: '/planner' },
    { icon: Target, label: 'Deadlines', href: '/deadlines' },
    { icon: RotateCcw, label: 'Revisions', href: '/revisions' },
    { icon: Clock, label: 'Sessions', href: '/sessions' },
    { icon: CreditCard, label: 'Flashcards', href: '/flashcards' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Download, label: 'Export/Import', href: '/export' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 flex flex-col shadow-sm"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="p-2 bg-blue-600 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                StudyFlow
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive && 'text-white'
                )} />
                
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 text-gray-600 hover:bg-red-50 hover:text-red-600',
              isCollapsed && 'justify-center'
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </form>
      </div>
    </motion.aside>
  )
}
