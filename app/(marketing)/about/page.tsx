'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Target, Users, Heart, Zap, Shield } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Student-Focused',
      description: 'Every feature is designed with students in mind, solving real academic challenges.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Simple & Powerful',
      description: 'Easy to use yet packed with features that help you succeed academically.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is yours. We prioritize security and never share your information.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      title: 'Built with Care',
      description: 'Crafted with attention to detail and genuine care for student success.',
      color: 'from-orange-500 to-red-500'
    },
  ]

  const stats = [
    { value: '10,000+', label: 'Active Students' },
    { value: '50,000+', label: 'Study Sessions' },
    { value: '100,000+', label: 'Resources Organized' },
    { value: '99.9%', label: 'Uptime' },
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
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">About StudyFlow</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Empowering Students to
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Achieve More
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            StudyFlow was born from a simple idea: students deserve better tools to organize their academic life and reach their full potential.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  StudyFlow started as a personal project by a group of students who were frustrated with scattered notes, missed deadlines, and disorganized study materials. We knew there had to be a better way.
                </p>
                <p>
                  After countless late-night coding sessions and feedback from fellow students, StudyFlow was born. What began as a simple note-taking app evolved into a comprehensive academic management platform that thousands of students now rely on daily.
                </p>
                <p>
                  Today, StudyFlow helps students worldwide organize their studies, track their progress, and achieve their academic goals. We're constantly improving based on feedback from our amazing community of users.
                </p>
              </div>
            </motion.div>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at StudyFlow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${value.color} mb-4`}>
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 bg-gradient-to-br from-primary/5 to-blue-500/5 border-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">StudyFlow by the Numbers</h2>
              <p className="text-lg text-muted-foreground">
                Join a growing community of successful students
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Card>
      </section>

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
              <Users className="h-16 w-16 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Join Our Community
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Be part of a growing community of students who are transforming their academic journey with StudyFlow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" variant="secondary" className="text-lg h-14 px-8">
                  <Link href="/signup">
                    Get Started Free
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg h-14 px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Link href="/contact">
                    Contact Us
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
