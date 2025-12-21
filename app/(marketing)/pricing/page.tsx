'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Up to 5 subjects',
        'Unlimited topics',
        'Basic resource library',
        'Study planner',
        'Deadline tracking',
        'Mobile app access',
        'Dark mode',
      ],
      cta: 'Get Started',
      href: '/signup',
      popular: false
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'per month',
      description: 'For serious students',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Everything in Free',
        'Unlimited subjects',
        'Advanced analytics',
        'Study session tracking',
        'Spaced repetition',
        'Priority support',
        'Export data',
        'Custom themes',
      ],
      cta: 'Start Free Trial',
      href: '/signup',
      popular: true
    },
    {
      name: 'Team',
      price: '$29',
      period: 'per month',
      description: 'For study groups',
      icon: Crown,
      color: 'from-orange-500 to-red-500',
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Shared resources',
        'Collaboration tools',
        'Team analytics',
        'Admin controls',
        'Dedicated support',
        'Custom branding',
      ],
      cta: 'Contact Sales',
      href: '/contact',
      popular: false
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
            <span className="text-sm font-medium text-primary">Simple Pricing</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Choose Your
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Start free and upgrade as you grow. No credit card required.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1 bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`p-8 h-full ${plan.popular ? 'border-primary border-2 shadow-xl' : 'border-2'}`}>
                <div className="space-y-6">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.color}`}>
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Plan Name */}
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    asChild 
                    size="lg" 
                    className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link href={plan.href}>
                      {plan.cta}
                    </Link>
                  </Button>

                  {/* Features */}
                  <div className="space-y-3 pt-6 border-t">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-sm text-muted-foreground">
                The Free plan is available forever. Pro and Team plans come with a 14-day free trial.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! Cancel anytime with no questions asked. Your data remains accessible.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-12 text-center bg-gradient-to-br from-primary to-blue-600 text-white border-0 shadow-2xl">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Still Have Questions?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Our team is here to help you choose the right plan for your needs.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg h-14 px-8">
                <Link href="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
