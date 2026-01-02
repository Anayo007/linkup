'use client';

import Link from 'next/link';
import { Download, Mail, ExternalLink } from 'lucide-react';

export default function PressPage() {
  const pressReleases = [
    {
      date: "January 2, 2026",
      title: "LinkUp Launches in London with Focus on Meaningful Connections",
      excerpt: "New dating app prioritizes authentic conversations over superficial swiping."
    },
    {
      date: "December 15, 2025",
      title: "LinkUp Raises Seed Funding to Transform Online Dating",
      excerpt: "Startup secures investment to build prompt-based dating platform."
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
      <section className="py-20 bg-gradient-to-b from-coral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Press & Media
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get the latest news, press releases, and media resources from LinkUp.
          </p>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-coral-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Press Inquiries</h2>
            <p className="text-gray-600 mb-6">
              For press inquiries, interviews, or media requests, please contact our communications team.
            </p>
            <a
              href="mailto:press@linkup.app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-coral-500 text-white rounded-full font-medium hover:bg-coral-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
              press@linkup.app
            </a>
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Brand Assets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-coral-400 to-coral-600 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-white font-bold text-3xl">L</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Logo</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our logo in various formats for press and media use.
              </p>
              <button className="flex items-center gap-2 text-coral-500 font-medium hover:text-coral-600">
                <Download className="w-4 h-4" />
                Download Logo Kit
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex gap-2 mb-4">
                <div className="w-12 h-12 bg-coral-500 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-900 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg border"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Brand Colors</h3>
              <p className="text-gray-600 text-sm mb-4">
                Primary: Coral (#FF6B4A), Secondary: Charcoal (#1F2937)
              </p>
              <button className="flex items-center gap-2 text-coral-500 font-medium hover:text-coral-600">
                <Download className="w-4 h-4" />
                Download Brand Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <p className="text-sm text-coral-500 font-medium mb-2">{release.date}</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{release.title}</h3>
                <p className="text-gray-600 mb-4">{release.excerpt}</p>
                <button className="flex items-center gap-2 text-coral-500 font-medium hover:text-coral-600">
                  Read More
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Facts */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Company Facts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-coral-500">2025</p>
              <p className="text-gray-600">Founded</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-coral-500">London</p>
              <p className="text-gray-600">Headquarters</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-coral-500">15+</p>
              <p className="text-gray-600">Team Members</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-coral-500">UK</p>
              <p className="text-gray-600">Launch Market</p>
            </div>
          </div>
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
