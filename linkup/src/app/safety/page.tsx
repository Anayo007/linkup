import Link from 'next/link';
import { ChevronLeft, Shield, MapPin, Phone, Users, AlertTriangle, Eye, MessageCircle } from 'lucide-react';

export default function SafetyPage() {
  const tips = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Chat first',
      description: 'Get to know someone through messages before meeting in person. Take your time and trust your instincts.',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Meet in public',
      description: 'Always meet in a public place for your first few dates. Coffee shops, restaurants, and busy parks are great options.',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Tell someone',
      description: 'Let a friend or family member know where you\'re going, who you\'re meeting, and when you expect to be back.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Arrange your own transport',
      description: 'Don\'t rely on your date for transportation. Have your own way to get there and back.',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Watch your drink',
      description: 'Never leave your drink unattended and be cautious about accepting drinks from others.',
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Trust your gut',
      description: 'If something feels off, it probably is. Don\'t be afraid to leave or end a date early if you\'re uncomfortable.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/settings" className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Dating Safety Tips</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-coral-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your safety matters</h2>
          <p className="text-gray-600">
            Meeting new people should be exciting, not scary. Here are some tips to help you stay safe while dating.
          </p>
        </div>

        {/* Tips */}
        <div className="space-y-6 mb-12">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-12 h-12 bg-coral-50 rounded-xl flex items-center justify-center flex-shrink-0 text-coral-500">
                {tip.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency */}
        <div className="bg-red-50 rounded-2xl p-6">
          <h3 className="font-semibold text-red-900 mb-2">In an emergency</h3>
          <p className="text-red-700 mb-4">
            If you ever feel unsafe or in danger, please contact emergency services immediately.
          </p>
          <div className="flex flex-col gap-2">
            <a href="tel:999" className="bg-red-500 text-white py-3 rounded-xl font-medium text-center hover:bg-red-600 transition-colors">
              Call 999 (Emergency)
            </a>
            <a href="tel:101" className="bg-white text-red-600 py-3 rounded-xl font-medium text-center border border-red-200 hover:bg-red-50 transition-colors">
              Call 101 (Non-emergency)
            </a>
          </div>
        </div>

        {/* Report */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            If someone on LinkUp makes you feel unsafe, please report them.
          </p>
          <p className="text-sm text-gray-500">
            You can report any user from their profile or from a chat conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
