'use client';

import Link from 'next/link';
import { MapPin, Clock, Briefcase, Heart, Code, Palette, TrendingUp, Users } from 'lucide-react';

export default function CareersPage() {
  const openings = [
    {
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      location: "London, UK (Hybrid)",
      type: "Full-time",
      icon: Code
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "London, UK (Hybrid)",
      type: "Full-time",
      icon: Palette
    },
    {
      title: "Growth Marketing Manager",
      department: "Marketing",
      location: "Remote (UK)",
      type: "Full-time",
      icon: TrendingUp
    },
    {
      title: "Community Manager",
      department: "Trust & Safety",
      location: "London, UK",
      type: "Full-time",
      icon: Users
    }
  ];

  const benefits = [
    "Competitive salary & equity",
    "Flexible working hours",
    "Remote-friendly culture",
    "25 days holiday + bank holidays",
    "Private health insurance",
    "Learning & development budget",
    "Mental health support",
    "Team socials & retreats"
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
            Join the LinkUp Team
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us build the future of meaningful connections. We're looking for passionate 
            people who want to make a difference in how people find love.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Join LinkUp?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-coral-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-coral-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Meaningful Mission</h3>
              <p className="text-gray-600">
                Every day, you'll help people find genuine connections and meaningful relationships.
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth Opportunity</h3>
              <p className="text-gray-600">
                Join a fast-growing startup where you can make a real impact and grow your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Benefits & Perks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-gray-700 font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <job.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-coral-500 font-medium mb-3">{job.department}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`mailto:careers@linkup.app?subject=Application: ${job.title}`}
                    className="px-4 py-2 bg-coral-500 text-white rounded-full font-medium hover:bg-coral-600 transition-colors"
                  >
                    Apply
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Don't see the right role?</h2>
          <p className="text-gray-400 mb-8">
            We're always looking for talented people. Send us your CV and we'll keep you in mind for future opportunities.
          </p>
          <a
            href="mailto:careers@linkup.app"
            className="inline-block px-8 py-4 bg-coral-500 text-white rounded-full font-semibold text-lg hover:bg-coral-600 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 LinkUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
