'use client';

import Link from 'next/link';

export default function CookiesPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2, 2026</p>

        <div className="prose prose-lg max-w-none text-gray-600">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. 
              They help websites remember your preferences and improve your browsing experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
            <p>LinkUp uses cookies for the following purposes:</p>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable core 
              functionality such as security, authentication, and session management.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Authentication tokens</li>
              <li>Session management</li>
              <li>Security features</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Functional Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization, such as remembering 
              your preferences and settings.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Language preferences</li>
              <li>Theme settings</li>
              <li>User preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting 
              and reporting information anonymously.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Page views and navigation</li>
              <li>Feature usage statistics</li>
              <li>Performance metrics</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Marketing Cookies</h3>
            <p>
              These cookies may be set through our site by advertising partners to build a profile 
              of your interests and show you relevant ads on other sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
            <p>
              You can control and manage cookies in various ways. Please note that removing or 
              blocking cookies may impact your user experience and some functionality may no longer 
              be available.
            </p>
            <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">Browser Settings</h3>
            <p>
              Most browsers allow you to refuse or accept cookies through their settings. Here's 
              how to manage cookies in popular browsers:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third-party services that appear on our pages. We do not 
              control these cookies. Please refer to the respective privacy policies of these third 
              parties for more information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, 
              legislation, or our data practices. Any changes will be posted on this page with an 
              updated revision date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at{' '}
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
