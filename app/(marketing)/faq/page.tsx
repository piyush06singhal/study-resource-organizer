'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { HelpCircle, ChevronDown, Search, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const categories = [
    {
      name: 'Getting Started',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the top right corner, enter your email and password, and verify your email address. It takes less than a minute!'
        },
        {
          question: 'Is StudyFlow really free?',
          answer: 'Yes! Our Free plan is available forever with no credit card required. You can upgrade to Pro or Team plans for additional features.'
        },
        {
          question: 'What devices can I use StudyFlow on?',
          answer: 'StudyFlow works on all devices - desktop, tablet, and mobile. We have responsive web apps and native mobile apps for iOS and Android.'
        },
      ]
    },
    {
      name: 'Features',
      faqs: [
        {
          question: 'How does the study planner work?',
          answer: 'The study planner lets you create daily and weekly schedules. You can assign subjects, topics, and time estimates to each study session. It integrates with your deadlines and sends reminders.'
        },
        {
          question: 'What is spaced repetition?',
          answer: 'Spaced repetition is a learning technique that schedules reviews at increasing intervals. StudyFlow automatically calculates when you should review each topic based on your confidence level.'
        },
        {
          question: 'Can I upload files?',
          answer: 'Yes! You can upload PDFs, images, and other study materials. Files are stored securely in the cloud and accessible from any device.'
        },
        {
          question: 'How does the session timer work?',
          answer: 'Start a study session with one click. The timer tracks your study time and automatically logs it to your analytics. You can add notes and link sessions to specific subjects and topics.'
        },
      ]
    },
    {
      name: 'Account & Billing',
      faqs: [
        {
          question: 'How do I upgrade my plan?',
          answer: 'Go to Settings > Billing and click "Upgrade Plan". Choose your plan and enter payment details. You can upgrade or downgrade anytime.'
        },
        {
          question: 'Can I cancel my subscription?',
          answer: 'Yes, you can cancel anytime from Settings > Billing. Your subscription remains active until the end of your billing period, and you can reactivate anytime.'
        },
        {
          question: 'Do you offer student discounts?',
          answer: 'Yes! Students get 50% off Pro and Team plans. Verify your student status with your .edu email address.'
        },
        {
          question: 'What happens to my data if I cancel?',
          answer: 'Your data remains accessible even after cancellation. You can export all your data anytime. We keep your data for 90 days after cancellation.'
        },
      ]
    },
    {
      name: 'Privacy & Security',
      faqs: [
        {
          question: 'Is my data secure?',
          answer: 'Absolutely! We use bank-level encryption (AES-256) for data at rest and TLS 1.3 for data in transit. We never share your data with third parties.'
        },
        {
          question: 'Can I export my data?',
          answer: 'Yes! You can export all your data in JSON or CSV format anytime from Settings > Data Export.'
        },
        {
          question: 'Do you sell my data?',
          answer: 'Never. We make money from subscriptions, not from selling data. Your privacy is our priority.'
        },
      ]
    },
    {
      name: 'Technical',
      faqs: [
        {
          question: 'What browsers are supported?',
          answer: 'StudyFlow works on all modern browsers: Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.'
        },
        {
          question: 'Is there an offline mode?',
          answer: 'Yes! Our mobile apps support offline mode. Changes sync automatically when you reconnect to the internet.'
        },
        {
          question: 'How do I report a bug?',
          answer: 'Click the "Report Bug" button in the app or email support@studyflow.com. Include screenshots if possible. We typically respond within 24 hours.'
        },
      ]
    },
  ]

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

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
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Help Center</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Frequently Asked
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about StudyFlow
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </motion.div>
      </section>

      {/* FAQ Categories */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex
                  const isOpen = openIndex === globalIndex

                  return (
                    <Card key={faqIndex} className="overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
                      >
                        <span className="font-semibold pr-4">{faq.question}</span>
                        <ChevronDown
                          className={`h-5 w-5 flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-6 pb-6 text-muted-foreground">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  )
                })}
              </div>
            </motion.div>
          ))}

          {filteredCategories.length === 0 && (
            <Card className="p-12 text-center">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                Try a different search term or browse all categories
              </p>
              <Button onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-12 text-center bg-gradient-to-br from-primary to-blue-600 text-white border-0 shadow-2xl">
            <div className="space-y-6">
              <MessageSquare className="h-16 w-16 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Still Need Help?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg h-14 px-8">
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
