'use client';

import Link from 'next/link';
import { Heart, Users, Shield, Sparkles } from 'lucide-react';

export default function AboutPage() {
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
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-coral-500 text-white rounded-full font-medium hover:bg-coral-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-coral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About LinkUp
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're on a mission to help people find meaningful connections through authentic conversations.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">
              LinkUp was born from a simple observation: traditional dating apps focus too much on 
              superficial swiping and not enough on what actually matters—genuine connection.
            </p>
            <p className="mb-4">
              We believe that the best relationships start with meaningful conversations. That's why 
              we built LinkUp around prompts and thoughtful responses, allowing you to like specific 
              parts of someone's profile that resonate with you.
            </p>
            <p>
              Our team is passionate about creating a safe, inclusive space where everyone can find 
              their person. We're committed to building features that encourage authenticity and 
              respect in every interaction.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-coral-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authenticity First</h3>
              <p className="text-gray-600">
                We encourage real conversations and genuine connections over superficial interactions.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety & Trust</h3>
              <p className="text-gray-600">
                Your safety is our priority. We have robust moderation and reporting tools.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusivity</h3>
              <p className="text-gray-600">
                LinkUp is for everyone. We celebrate diversity and welcome all backgrounds.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Over Quantity</h3>
              <p className="text-gray-600">
                We focus on meaningful matches, not endless swiping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to find your person?</h2>
          <p className="text-gray-600 mb-8">Join thousands of singles looking for meaningful connections.</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-coral-500 text-white rounded-full font-semibold text-lg hover:bg-coral-600 transition-colors"
          >
            Get Started Free
          </Link>
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
