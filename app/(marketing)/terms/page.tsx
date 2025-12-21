import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Card className="p-8 md:p-12">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
                <p className="text-sm text-muted-foreground mt-1">Last updated: December 21, 2025</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using StudyFlow ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  StudyFlow provides an online platform for students to organize their study materials, track progress, manage deadlines, and plan their academic activities. The Service includes web and mobile applications, cloud storage, and related features.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>3.1 Registration:</strong> You must create an account to use certain features of the Service. You agree to provide accurate, current, and complete information during registration.
                  </p>
                  <p>
                    <strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                  <p>
                    <strong>3.3 Age Requirement:</strong> You must be at least 13 years old to use the Service. Users under 18 should have parental consent.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. User Content</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>4.1 Ownership:</strong> You retain all rights to the content you upload to the Service. By uploading content, you grant StudyFlow a license to store, display, and process your content solely for providing the Service.
                  </p>
                  <p>
                    <strong>4.2 Responsibility:</strong> You are solely responsible for the content you upload. You must not upload content that is illegal, infringes on others' rights, or violates these Terms.
                  </p>
                  <p>
                    <strong>4.3 Backup:</strong> While we take reasonable measures to protect your data, you are responsible for maintaining your own backups.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Acceptable Use</h2>
                <p className="text-muted-foreground mb-3">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Use the Service for any illegal purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Upload malicious code or viruses</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Use the Service to spam or harass others</li>
                  <li>Impersonate any person or entity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Subscription and Payment</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>6.1 Free Plan:</strong> The Free plan is available at no cost with limited features.
                  </p>
                  <p>
                    <strong>6.2 Paid Plans:</strong> Paid subscriptions are billed monthly or annually in advance. Prices are subject to change with 30 days notice.
                  </p>
                  <p>
                    <strong>6.3 Cancellation:</strong> You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.
                  </p>
                  <p>
                    <strong>6.4 Refunds:</strong> We offer a 14-day money-back guarantee for new subscriptions. Refunds are not available for renewals.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The Service, including its design, features, and content (excluding user content), is owned by StudyFlow and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of the Service without our written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Privacy</h2>
                <p className="text-muted-foreground">
                  Your use of the Service is also governed by our Privacy Policy. Please review our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, STUDYFLOW SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason. Upon termination, your right to use the Service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may modify these Terms at any time. We will notify you of material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-3 text-muted-foreground">
                  <p>Email: legal@studyflow.com</p>
                  <p>Address: 123 Study Street, Education City, ED 12345</p>
                </div>
              </section>

              <div className="pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  By using StudyFlow, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
