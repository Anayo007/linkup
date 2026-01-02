'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MessageCircle, Heart } from 'lucide-react';

interface Match {
  id: string;
  otherUser: {
    id: string;
    name: string;
    photo: string;
  };
  lastMessage?: {
    text: string;
    createdAt: string;
    isFromMe: boolean;
  };
  likedContent?: {
    type: string;
    text?: string;
  };
  createdAt: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-GB', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h2>
          <p className="text-gray-500 mb-6">
            When you match with someone, you can start chatting here
          </p>
          <button
            onClick={() => router.push('/discover')}
            className="px-6 py-3 bg-coral-500 text-white rounded-full font-medium hover:bg-coral-600 transition-colors"
          >
            Start discovering
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {matches.map((match) => (
            <button
              key={match.id}
              onClick={() => router.push(`/messages/${match.id}`)}
              className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {match.otherUser.photo ? (
                    <Image
                      src={match.otherUser.photo}
                      alt={match.otherUser.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-medium">
                      {match.otherUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                {match.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-coral-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{match.unreadCount}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{match.otherUser.name}</h3>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {formatTime(match.lastMessage?.createdAt || match.createdAt)}
                  </span>
                </div>
                
                {match.lastMessage ? (
                  <p className={`text-sm truncate ${match.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {match.lastMessage.isFromMe && <span className="text-gray-400">You: </span>}
                    {match.lastMessage.text}
                  </p>
                ) : match.likedContent ? (
                  <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                    <Heart className="w-3 h-3 text-coral-500 fill-coral-500" />
                    Liked your {match.likedContent.type}
                  </p>
                ) : (
                  <p className="text-sm text-coral-500 font-medium">New match! Say hello 👋</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
