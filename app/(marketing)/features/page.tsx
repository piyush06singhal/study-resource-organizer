'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  BookOpen, Calendar, Target, TrendingUp, FileText, Clock,
  BarChart3, Bell, Users, Shield, Zap, Heart, CheckCircle2,
  Sparkles, Folder, Tag, Search, Download, Upload, Edit3,
  RefreshCw, Award, Flame, Moon, Smartphone
} from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      category: 'Organization',
      icon: Folder,
      color: 'from-blue-500 to-cyan-500',
      items: [
        { icon: BookOpen, title: 'Subject Management', description: 'Organize your courses with custom colors and descriptions' },
        { icon: FileText, title: 'Topic Tracking', description: 'Break down subjects into manageable topics with status tracking' },
        { icon: Tag, title: 'Resource Library', description: 'Store PDFs, images, links, and notes in one place' },
        { icon: Search, title: 'Smart Search', description: 'Find any resource, topic, or subject instantly' },
      ]
    },
    {
      category: 'Planning',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      items: [
        { icon: Calendar, title: 'Study Planner', description: 'Create daily and weekly study schedules' },
        { icon: Target, title: 'Deadline Tracker', description: 'Never miss an assignment or exam with countdown timers' },
        { icon: Clock, title: 'Time Estimation', description: 'Plan realistic study sessions with time estimates' },
        { icon: Bell, title: 'Smart Reminders', description: 'Get notified about upcoming deadlines and revisions' },
      ]
    },
    {
      category: 'Progress Tracking',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      items: [
        { icon: CheckCircle2, title: 'Topic Completion', description: 'Track your progress through each topic' },
        { icon: BarChart3, title: 'Analytics Dashboard', description: 'Visualize your study patterns with charts' },
        { icon: Flame, title: 'Study Streaks', description: 'Build consistency with daily study streak tracking' },
        { icon: Award, title: 'Achievements', description: 'Celebrate milestones and stay motivated' },
      ]
    },
    {
      category: 'Study Tools',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      items: [
        { icon: Clock, title: 'Session Timer', description: 'Track study time with built-in timer' },
        { icon: RefreshCw, title: 'Spaced Repetition', description: 'Optimize revision with proven learning techniques' },
        { icon: Edit3, title: 'Note Taking', description: 'Create and organize study notes' },
        { icon: Download, title: 'Export Data', description: 'Download your data anytime' },
      ]
    },
    {
      category: 'Collaboration',
      icon: Users,
      color: 'from-indigo-500 to-blue-500',
      items: [
        { icon: Upload, title: 'File Uploads', description: 'Upload and share study materials' },
        { icon: FileText, title: 'Resource Sharing', description: 'Organize resources by topic' },
        { icon: Bell, title: 'Notifications', description: 'Stay updated with in-app notifications' },
        { icon: Heart, title: 'Favorites', description: 'Mark important resources and topics' },
      ]
    },
    {
      category: 'Customization',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
      items: [
        { icon: Moon, title: 'Dark Mode', description: 'Easy on the eyes with dark theme support' },
        { icon: Smartphone, title: 'Responsive Design', description: 'Works perfectly on all devices' },
        { icon: Shield, title: 'Privacy First', description: 'Your data is secure and private' },
        { icon: Zap, title: 'Fast & Reliable', description: 'Lightning-fast performance' },
      ]
    },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Excel Academically
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            StudyFlow combines powerful organization tools, smart planning features, and insightful analytics to help you achieve your academic goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg h-14 px-8">
              <Link href="/signup">
                Start Free Trial
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg h-14 px-8">
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      {features.map((category, categoryIndex) => (
        <section key={categoryIndex} className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Category Header */}
            <div className="text-center space-y-4">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${category.color} mb-4`}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">{category.category}</h2>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((feature, featureIndex) => (
                <motion.div
                  key={featureIndex}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-12 text-center bg-gradient-to-br from-primary to-blue-600 text-white border-0 shadow-2xl">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Transform Your Studies?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Join thousands of students who are already using StudyFlow to organize their academic life and achieve better results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" variant="secondary" className="text-lg h-14 px-8">
                  <Link href="/signup">
                    Get Started Free
                    <Zap className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
