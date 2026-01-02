import Link from 'next/link';
import { Heart, MessageCircle, Shield, Sparkles, ChevronDown, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
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
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium hidden sm:block">
              Pricing
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-coral-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-coral-600 transition-colors shadow-lg shadow-coral-500/25"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-coral-50 text-coral-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            The dating app that gets it right
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Date with intention.
            <br />
            <span className="bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent">
              Like what you actually like.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            No more endless swiping. On LinkUp, you like specific photos or prompt answers that catch your eye. 
            When someone likes you back, it&apos;s a match made with meaning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-coral-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-coral-600 transition-all shadow-xl shadow-coral-500/30 hover:shadow-coral-500/40 hover:-translate-y-0.5"
            >
              Join now — it&apos;s free
            </Link>
            <Link
              href="#how-it-works"
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Phone Mockup */}
      <section className="py-10 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl">
            <div className="bg-white rounded-[2.5rem] overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Sarah, 28</span>
                <span className="text-sm text-gray-500">2 miles away</span>
              </div>
              <div className="aspect-[3/4] bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-coral-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">👩</span>
                  </div>
                  <p className="text-gray-700 font-medium">Profile Photo</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-coral-50 rounded-2xl p-4 border-2 border-coral-200">
                  <p className="text-sm text-coral-600 font-medium mb-1">My ideal first date is...</p>
                  <p className="text-gray-900">&quot;A cozy coffee shop, good conversation, and seeing where it goes&quot;</p>
                  <button className="mt-3 flex items-center gap-2 text-coral-500 font-medium text-sm">
                    <Heart className="w-4 h-4" /> Like this answer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How LinkUp works</h2>
            <p className="text-xl text-gray-600">Three simple steps to meaningful connections</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your profile',
                description: 'Add your best photos and answer prompts that show off your personality. Be authentic — that\'s what attracts the right people.',
                icon: '✨',
              },
              {
                step: '02',
                title: 'Like what stands out',
                description: 'Browse profiles and like specific photos or prompt answers. Add a comment to start the conversation with context.',
                icon: '💬',
              },
              {
                step: '03',
                title: 'Match and chat',
                description: 'When someone likes you back, it\'s a match! Start chatting and see where the connection takes you.',
                icon: '💕',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-coral-500 font-bold text-sm mb-2">STEP {item.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why you&apos;ll love LinkUp</h2>
            <p className="text-xl text-gray-600">Features designed for real connections</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'Targeted likes',
                description: 'Like specific photos or prompts, not just the whole profile. Show what actually caught your attention.',
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: 'Comments with likes',
                description: 'Add a thoughtful comment when you like something. Start conversations with context.',
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Personality prompts',
                description: 'Answer fun prompts that reveal who you really are. No more boring bios.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Safety first',
                description: 'Report and block features, community guidelines, and active moderation keep you safe.',
              },
              {
                icon: <Check className="w-6 h-6" />,
                title: 'Quality matches',
                description: 'Our matching system prioritizes compatibility over quantity. Fewer, better matches.',
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'Match insights',
                description: 'See exactly what your match liked about your profile. Great conversation starters!',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:bg-coral-50 transition-colors group">
                <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center text-coral-500 mb-4 group-hover:bg-coral-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Love stories start here</h2>
            <p className="text-xl text-gray-600">Real people, real connections</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I loved that my match commented on my travel photo. We bonded over our shared love of Italy and now we're planning a trip together!",
                name: 'Emma, 29',
                location: 'London',
              },
              {
                quote: "Finally, an app where I can show my personality through prompts. Met my girlfriend because she loved my answer about Sunday mornings.",
                name: 'James, 32',
                location: 'Manchester',
              },
              {
                quote: "The quality of conversations is so much better when someone likes something specific. It gives you something real to talk about.",
                name: 'Sophie, 27',
                location: 'Bristol',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-coral-500">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to find your person?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of singles in London who are dating with intention.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-coral-500 text-white px-10 py-5 rounded-xl font-semibold text-xl hover:bg-coral-600 transition-all shadow-xl shadow-coral-500/30 hover:shadow-coral-500/40 hover:-translate-y-0.5"
          >
            Get started free
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Is LinkUp free to use?',
                a: 'Yes! LinkUp is completely free to use. Create your profile, browse, like, match, and chat — all for free.',
              },
              {
                q: 'How is LinkUp different from other dating apps?',
                a: 'Instead of swiping on entire profiles, you like specific photos or prompt answers. This leads to more meaningful matches and better conversations.',
              },
              {
                q: 'How do matches work?',
                a: 'When you like something on someone\'s profile and they like something on yours, it\'s a match! You can then start chatting.',
              },
              {
                q: 'Can I see who liked me?',
                a: 'Yes! You can see who has liked your profile and what specifically they liked. This helps you decide if you want to like them back.',
              },
              {
                q: 'How do I stay safe on LinkUp?',
                a: 'We have robust reporting and blocking features, active moderation, and community guidelines. We also provide dating safety tips.',
              },
              {
                q: 'What are prompts?',
                a: 'Prompts are fun questions you answer to show your personality. Things like "My ideal first date is..." or "I geek out on..." They help people get to know the real you.',
              },
              {
                q: 'Can I delete my account?',
                a: 'Yes, you can delete your account at any time from the settings. We\'ll remove all your data in accordance with GDPR.',
              },
              {
                q: 'Is LinkUp available outside London?',
                a: 'We\'re starting in London but expanding soon! Sign up to be notified when we launch in your area.',
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl shadow-sm group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="text-2xl font-bold">LinkUp</span>
              </div>
              <p className="text-gray-400">Date with intention. Like what you actually like.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/safety" className="hover:text-white transition-colors">Safety Tips</Link></li>
                <li><Link href="/guidelines" className="hover:text-white transition-colors">Community Guidelines</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 LinkUp. All rights reserved. Made with ❤️ in London.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
