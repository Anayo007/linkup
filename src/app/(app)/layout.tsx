'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Heart, MessageCircle, User } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/discover', icon: Compass, label: 'Discover' },
    { href: '/matches', icon: Heart, label: 'Matches' },
    { href: '/messages', icon: MessageCircle, label: 'Messages' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  // Only hide nav on individual chat pages (e.g., /messages/123), show on /messages
  const isIndividualChat = pathname.match(/^\/messages\/[^/]+$/);
  const showNav = !isIndividualChat;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}
      
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50 shadow-lg">
          <div className="max-w-lg mx-auto flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/messages' && pathname.startsWith(item.href + '/')) ||
                (item.href === '/messages' && pathname === '/messages');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center py-3 px-5 transition-colors ${
                    isActive ? 'text-coral-500' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                  <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
