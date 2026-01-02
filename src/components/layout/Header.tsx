'use client';

import Link from 'next/link';
import { Settings, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

interface HeaderProps {
  title?: string;
  showSettings?: boolean;
}

export function Header({ title = 'LinkUp', showSettings = true }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-30">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/discover" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-coral-400 to-coral-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent">
            {title}
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          {user?.isAdmin && (
            <Link
              href="/admin"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Shield className="w-5 h-5 text-gray-600" />
            </Link>
          )}
          {showSettings && (
            <Link
              href="/settings"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
