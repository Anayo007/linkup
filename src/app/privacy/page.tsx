'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LinkUp</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2, 2026</p>

        <div className="prose prose-lg max-w-none text-gray-600">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              At LinkUp, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our dating application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, phone number, date of birth)</li>
              <li>Profile information (photos, bio, prompts and answers)</li>
              <li>Preferences (age range, distance, gender preferences)</li>
              <li>Messages and communications with other users</li>
              <li>Payment information (if applicable)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (device type, operating system)</li>
              <li>Usage data (features used, time spent, interactions)</li>
              <li>Location data (with your permission)</li>
              <li>Log data (IP address, browser type, access times)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide and maintain our service</li>
              <li>Match you with other users based on your preferences</li>
              <li>Enable communication between matched users</li>
              <li>Improve and personalize your experience</li>
              <li>Ensure safety and prevent fraud</li>
              <li>Send you updates and marketing communications (with consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Other users (profile information you choose to share)</li>
              <li>Service providers who assist in operating our platform</li>
              <li>Law enforcement when required by law</li>
              <li>Business partners (with your consent)</li>
            </ul>
            <p className="mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information. However, no method of transmission over the Internet is 100% secure, and 
              we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights (GDPR)</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Access</strong> - Request a copy of your personal data</li>
              <li><strong>Rectification</strong> - Request correction of inaccurate data</li>
              <li><strong>Erasure</strong> - Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Portability</strong> - Request transfer of your data</li>
              <li><strong>Restriction</strong> - Request limitation of processing</li>
              <li><strong>Object</strong> - Object to processing of your data</li>
              <li><strong>Withdraw consent</strong> - Withdraw consent at any time</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@linkup.app" className="text-coral-500 hover:text-coral-600">
                privacy@linkup.app
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed 
              to provide services. You can delete your account at any time through the app settings. 
              After deletion, we may retain certain information as required by law or for legitimate 
              business purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for such transfers in compliance with 
              applicable data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p>
              LinkUp is not intended for users under 18 years of age. We do not knowingly collect 
              personal information from children. If we learn we have collected information from a 
              child, we will delete it immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact our Data Protection Officer at:{' '}
              <a href="mailto:privacy@linkup.app" className="text-coral-500 hover:text-coral-600">
                privacy@linkup.app
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 LinkUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
