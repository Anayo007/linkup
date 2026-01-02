'use client';

import Link from 'next/link';

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2, 2026</p>

        <div className="prose prose-lg max-w-none text-gray-600">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using LinkUp, you agree to be bound by these Terms of Service and all 
              applicable laws and regulations. If you do not agree with any of these terms, you are 
              prohibited from using or accessing this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligibility</h2>
            <p>You must be at least 18 years old to use LinkUp. By using our service, you represent and warrant that:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into a binding agreement</li>
              <li>You are not prohibited from using the service under applicable laws</li>
              <li>You do not have any unspent convictions for violent or sexual offences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
            <p>
              To use LinkUp, you must create an account. You agree to provide accurate, current, and 
              complete information during registration and to update such information to keep it accurate.
            </p>
            <p className="mt-4">
              You are responsible for safeguarding your password and for all activities that occur under 
              your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Use the service for any illegal purpose</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Post false, misleading, or deceptive content</li>
              <li>Impersonate any person or entity</li>
              <li>Solicit money or other items of value from other users</li>
              <li>Use the service for commercial purposes without our consent</li>
              <li>Attempt to circumvent any security features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content</h2>
            <p>
              You retain ownership of content you post on LinkUp. By posting content, you grant us a 
              non-exclusive, royalty-free, worldwide license to use, display, and distribute your content 
              in connection with the service.
            </p>
            <p className="mt-4">
              We reserve the right to remove any content that violates these terms or our Community Guidelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Safety</h2>
            <p>
              While we strive to create a safe environment, we cannot guarantee the conduct of users. 
              You are solely responsible for your interactions with other users. We encourage you to 
              review our Safety Tips before meeting anyone in person.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
            <p>
              We may terminate or suspend your account at any time, without prior notice, for conduct 
              that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers</h2>
            <p>
              LinkUp is provided "as is" without warranties of any kind. We do not guarantee that the 
              service will be uninterrupted, secure, or error-free. We are not responsible for any 
              damages arising from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any 
              material changes. Your continued use of the service after changes constitutes acceptance 
              of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@linkup.app" className="text-coral-500 hover:text-coral-600">
                legal@linkup.app
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
