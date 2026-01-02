'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, Sparkles, Crown, Zap, Heart, MessageCircle, Undo2, Star, Shield } from 'lucide-react';

const packages = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with the basics',
    price: 0,
    period: 'forever',
    icon: Heart,
    color: 'gray',
    popular: false,
    features: [
      { text: '10 likes per day', included: true },
      { text: 'See who likes you (blurred)', included: true },
      { text: 'Basic discovery filters', included: true },
      { text: '3 prompts on profile', included: true },
      { text: 'Unlimited matches & messaging', included: true },
      { text: 'Undo last swipe', included: false },
      { text: 'See who viewed your profile', included: false },
      { text: 'Advanced filters', included: false },
      { text: 'Priority likes', included: false },
      { text: 'Incognito mode', included: false },
      { text: 'Read receipts', included: false },
    ],
    cta: 'Get Started',
    ctaLink: '/signup',
  },
  {
    id: 'plus',
    name: 'LinkUp+',
    description: 'For serious daters',
    price: 14.99,
    period: 'month',
    icon: Zap,
    color: 'coral',
    popular: true,
    features: [
      { text: 'Unlimited likes', included: true },
      { text: 'See who likes you (clear)', included: true },
      { text: 'Basic discovery filters', included: true },
      { text: '5 prompts on profile', included: true },
      { text: 'Unlimited matches & messaging', included: true },
      { text: '5 undos per day', included: true },
      { text: 'See who viewed your profile', included: true },
      { text: 'Advanced filters (height, education)', included: true },
      { text: 'Priority likes', included: false },
      { text: 'Incognito mode', included: false },
      { text: 'Read receipts', included: false },
    ],
    cta: 'Upgrade to Plus',
    ctaLink: '/signup?plan=plus',
  },
  {
    id: 'premium',
    name: 'LinkUp Premium',
    description: 'The ultimate dating experience',
    price: 29.99,
    period: 'month',
    icon: Crown,
    color: 'amber',
    popular: false,
    features: [
      { text: 'Unlimited likes', included: true },
      { text: 'See who likes you (clear)', included: true },
      { text: 'All discovery filters', included: true },
      { text: '6 prompts on profile', included: true },
      { text: 'Unlimited matches & messaging', included: true },
      { text: 'Unlimited undos', included: true },
      { text: 'See who viewed your profile', included: true },
      { text: 'All advanced filters', included: true },
      { text: 'Priority likes (seen first)', included: true },
      { text: 'Incognito mode', included: true },
      { text: 'Read receipts', included: true },
    ],
    cta: 'Go Premium',
    ctaLink: '/signup?plan=premium',
    extras: ['Weekly profile boost', 'Priority support', 'Exclusive events access'],
  },
];

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes! You can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, debit cards, Apple Pay, and Google Pay.',
  },
  {
    q: 'Is there a free trial?',
    a: 'New users get a 7-day free trial of LinkUp+ when they sign up. No credit card required to start.',
  },
  {
    q: 'Can I switch plans?',
    a: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing date.',
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return 0;
    if (billingPeriod === 'yearly') {
      return (basePrice * 12 * 0.7).toFixed(2); // 30% discount for yearly
    }
    return basePrice.toFixed(2);
  };

  const getMonthlyEquivalent = (basePrice: number) => {
    if (basePrice === 0) return '0';
    if (billingPeriod === 'yearly') {
      return (basePrice * 0.7).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent">
              LinkUp
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-coral-500 text-white px-5 py-2 rounded-full font-medium hover:bg-coral-600 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-coral-50 text-coral-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Find your perfect match
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose your path to{' '}
            <span className="bg-gradient-to-r from-coral-500 to-orange-500 bg-clip-text text-transparent">
              meaningful connections
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start free, upgrade when you&apos;re ready. All plans include unlimited messaging with your matches.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-5 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                Save 30%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-3xl p-6 lg:p-8 ${
                  pkg.popular
                    ? 'ring-2 ring-coral-500 shadow-xl scale-105'
                    : 'border border-gray-200 shadow-lg'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-coral-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                      pkg.color === 'coral'
                        ? 'bg-coral-100 text-coral-600'
                        : pkg.color === 'amber'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <pkg.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                  <p className="text-gray-500">{pkg.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      £{getMonthlyEquivalent(pkg.price)}
                    </span>
                    {pkg.price > 0 && <span className="text-gray-500">/month</span>}
                  </div>
                  {pkg.price > 0 && billingPeriod === 'yearly' && (
                    <p className="text-sm text-gray-500 mt-1">
                      £{getPrice(pkg.price)} billed yearly
                    </p>
                  )}
                  {pkg.price === 0 && (
                    <p className="text-sm text-green-600 font-medium mt-1">Free forever</p>
                  )}
                </div>

                <Link
                  href={pkg.ctaLink}
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all mb-6 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-coral-500 to-orange-500 text-white hover:shadow-lg hover:scale-[1.02]'
                      : pkg.color === 'amber'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-[1.02]'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {pkg.cta}
                </Link>

                <div className="space-y-3">
                  {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {pkg.extras && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm font-semibold text-amber-600 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Premium Extras
                    </p>
                    <div className="space-y-2">
                      {pkg.extras.map((extra, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          {extra}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare all features
          </h2>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-sm">
              <div className="text-gray-600">Feature</div>
              <div className="text-center text-gray-600">Free</div>
              <div className="text-center text-coral-600">Plus</div>
              <div className="text-center text-amber-600">Premium</div>
            </div>

            {[
              { feature: 'Daily likes', free: '10', plus: 'Unlimited', premium: 'Unlimited' },
              { feature: 'See who likes you', free: 'Blurred', plus: 'Clear', premium: 'Clear' },
              { feature: 'Undo swipes', free: '—', plus: '5/day', premium: 'Unlimited' },
              { feature: 'Profile prompts', free: '3', plus: '5', premium: '6' },
              { feature: 'Advanced filters', free: '—', plus: '✓', premium: '✓' },
              { feature: 'Profile views', free: '—', plus: '✓', premium: '✓' },
              { feature: 'Priority likes', free: '—', plus: '—', premium: '✓' },
              { feature: 'Incognito mode', free: '—', plus: '—', premium: '✓' },
              { feature: 'Read receipts', free: '—', plus: '—', premium: '✓' },
              { feature: 'Weekly boost', free: '—', plus: '—', premium: '✓' },
            ].map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-4 gap-4 p-4 text-sm ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-900">{row.feature}</div>
                <div className="text-center text-gray-600">{row.free}</div>
                <div className="text-center text-coral-600 font-medium">{row.plus}</div>
                <div className="text-center text-amber-600 font-medium">{row.premium}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">
                256-bit SSL encryption. Your payment info is always safe.
              </p>
            </div>
            <div>
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Undo2 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cancel Anytime</h3>
              <p className="text-gray-600 text-sm">
                No long-term contracts. Cancel with one click.
              </p>
            </div>
            <div>
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">
                Our team is here to help whenever you need us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to find your person?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of singles who&apos;ve found meaningful connections on LinkUp.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Heart className="w-5 h-5" />
            Start for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-coral-400 to-coral-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-white font-bold">LinkUp</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/safety" className="hover:text-white transition-colors">Safety</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
            <p className="text-sm">© 2025 LinkUp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
