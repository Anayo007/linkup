import Link from 'next/link';
import { ChevronLeft, Heart, Shield, Users, Ban, AlertTriangle } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/settings" className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Community Guidelines</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to LinkUp</h2>
          <p className="text-gray-600 mb-4">
            LinkUp is a community built on respect, authenticity, and meaningful connections. 
            These guidelines help ensure everyone has a positive experience.
          </p>
          <p className="text-gray-600">
            By using LinkUp, you agree to follow these guidelines. Violations may result in 
            warnings, suspensions, or permanent bans.
          </p>
        </div>

        {/* Guidelines */}
        <div className="space-y-8">
          {/* Be Authentic */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-coral-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-coral-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Be authentic</h3>
            </div>
            <ul className="space-y-2 text-gray-600 ml-13">
              <li>• Use your real name and recent photos</li>
              <li>• Be honest about who you are and what you&apos;re looking for</li>
              <li>• Don&apos;t impersonate others or create fake profiles</li>
              <li>• Only create one account per person</li>
            </ul>
          </section>

          {/* Be Respectful */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Be respectful</h3>
            </div>
            <ul className="space-y-2 text-gray-600 ml-13">
              <li>• Treat others the way you want to be treated</li>
              <li>• Accept rejection gracefully — not everyone will be a match</li>
              <li>• Don&apos;t send unsolicited explicit content</li>
              <li>• Respect people&apos;s boundaries and privacy</li>
              <li>• No harassment, bullying, or hate speech</li>
            </ul>
          </section>

          {/* Stay Safe */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Stay safe</h3>
            </div>
            <ul className="space-y-2 text-gray-600 ml-13">
              <li>• Don&apos;t share personal information too quickly</li>
              <li>• Report suspicious behavior immediately</li>
              <li>• Never send money to someone you haven&apos;t met</li>
              <li>• Meet in public places for first dates</li>
            </ul>
          </section>

          {/* Not Allowed */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Not allowed</h3>
            </div>
            <ul className="space-y-2 text-gray-600 ml-13">
              <li>• Users under 18 years old</li>
              <li>• Nudity or sexually explicit content in photos</li>
              <li>• Spam, scams, or commercial solicitation</li>
              <li>• Violence, threats, or illegal activity</li>
              <li>• Discrimination based on race, gender, sexuality, religion, etc.</li>
              <li>• Sharing others&apos; private information without consent</li>
            </ul>
          </section>
        </div>

        {/* Reporting */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-coral-500" />
            <h3 className="text-lg font-semibold text-gray-900">See something wrong?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            If you encounter behavior that violates these guidelines, please report it. 
            You can report users from their profile or from a chat conversation.
          </p>
          <p className="text-gray-600">
            All reports are reviewed by our moderation team. We take every report seriously 
            and will take appropriate action.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: January 2026</p>
          <p className="mt-2">
            Questions? Contact us at{' '}
            <a href="mailto:support@linkup.app" className="text-coral-500 hover:underline">
              support@linkup.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
