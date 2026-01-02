'use client';

import Link from 'next/link';
import { Mail, MessageCircle, FileText, Shield, HelpCircle, ChevronRight } from 'lucide-react';

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a link to reset your password."
    },
    {
      question: "How do I delete my account?",
      answer: "Go to Settings > Account > Delete Account. Please note this action is permanent and cannot be undone."
    },
    {
      question: "How do I report a user?",
      answer: "Open the user's profile, tap the three dots menu, and select 'Report'. Choose a reason and provide any additional details."
    },
    {
      question: "Why was my account suspended?",
      answer: "Accounts may be suspended for violating our Community Guidelines. If you believe this was a mistake, please contact us."
    },
    {
      question: "How do I change my preferences?",
      answer: "Go to Settings > Preferences to update your age range, distance, and gender preferences."
    },
    {
      question: "Can I hide my profile temporarily?",
      answer: "Yes! Go to Settings > Privacy > Hide Profile. Your profile won't appear in discovery but your matches will remain."
    }
  ];

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

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-coral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help?</h1>
          <p className="text-xl text-gray-600">Find answers to common questions or get in touch with our support team.</p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/safety" className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-coral-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Tips</h3>
              <p className="text-gray-600 text-sm">Learn how to stay safe while dating online and in person.</p>
            </Link>

            <Link href="/guidelines" className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Guidelines</h3>
              <p className="text-gray-600 text-sm">Understand our rules for a respectful community.</p>
            </Link>

            <a href="mailto:support@linkup.app" className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm">Get help from our support team via email.</p>
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-coral-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-8">Our support team is here to assist you with any questions or concerns.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@linkup.app"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-coral-500 text-white rounded-full font-medium hover:bg-coral-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            We typically respond within 24-48 hours.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 LinkUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
