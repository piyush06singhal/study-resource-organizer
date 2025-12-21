import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrivacyPage() {
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
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground mt-1">Last updated: December 21, 2025</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  At StudyFlow, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. Please read this policy carefully.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">2.1 Information You Provide</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li><strong>Account Information:</strong> Name, email address, password</li>
                      <li><strong>Profile Information:</strong> Bio, study goals, avatar</li>
                      <li><strong>Content:</strong> Study materials, notes, subjects, topics, deadlines</li>
                      <li><strong>Payment Information:</strong> Billing details (processed by secure third-party providers)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">2.2 Automatically Collected Information</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li><strong>Usage Data:</strong> Pages visited, features used, time spent</li>
                      <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
                      <li><strong>Log Data:</strong> IP address, access times, error logs</li>
                      <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-3">We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide, maintain, and improve the Service</li>
                  <li>Process your transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, prevent, and address technical issues and security threats</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. How We Share Your Information</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>We do not sell your personal information.</strong> We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (hosting, analytics, payment processing)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>With Your Consent:</strong> When you explicitly agree to share your information</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground mb-3">
                  We implement appropriate technical and organizational measures to protect your information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Encryption of data in transit (TLS 1.3) and at rest (AES-256)</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Secure data centers with physical security measures</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your information for as long as your account is active or as needed to provide the Service. After account deletion, we retain your data for 90 days before permanent deletion. Some information may be retained longer for legal or business purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Your Rights and Choices</h2>
                <p className="text-muted-foreground mb-3">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct your information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Export:</strong> Download your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Object:</strong> Object to certain processing of your information</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  To exercise these rights, contact us at privacy@studyflow.com or use the settings in your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Cookies and Tracking</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>We use cookies and similar tracking technologies to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for the Service to function</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Analytics Cookies:</strong> Understand how you use the Service</li>
                    <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (with consent)</li>
                  </ul>
                  <p className="mt-3">
                    You can control cookies through your browser settings. Disabling certain cookies may limit functionality.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Third-Party Services</h2>
                <p className="text-muted-foreground">
                  The Service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  The Service is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. International Data Transfers</h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. California Privacy Rights</h2>
                <p className="text-muted-foreground">
                  California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected, the right to delete personal information, and the right to opt-out of the sale of personal information. We do not sell personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">13. GDPR Compliance</h2>
                <p className="text-muted-foreground">
                  For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). Our legal basis for processing your information includes consent, contract performance, legal obligations, and legitimate interests.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">14. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of material changes by email or through the Service. The "Last updated" date at the top indicates when the policy was last revised.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">15. Contact Us</h2>
                <p className="text-muted-foreground mb-3">
                  If you have questions or concerns about this Privacy Policy, please contact us:
                </p>
                <div className="text-muted-foreground space-y-1">
                  <p><strong>Email:</strong> privacy@studyflow.com</p>
                  <p><strong>Address:</strong> 123 Study Street, Education City, ED 12345</p>
                  <p><strong>Data Protection Officer:</strong> dpo@studyflow.com</p>
                </div>
              </section>

              <div className="pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  By using StudyFlow, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
