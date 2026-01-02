'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Match {
  id: string;
  createdAt: string;
  lastMessageAt: string | null;
  otherUser: {
    id: string;
    name: string;
    age: number;
    photo?: string;
  };
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: string;
  } | null;
  likeInfo?: {
    comment?: string;
    photo?: { url: string };
    promptAnswer?: {
      answer: string;
      prompt: { text: string };
    };
  };
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    );
  }

  const newMatches = matches.filter(m => !m.lastMessage);
  const conversations = matches.filter(m => m.lastMessage);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="bg-white px-4 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
        </div>

        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-coral-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No matches yet</h2>
            <p className="text-gray-600 mb-6">
              Keep liking profiles to find your match!
            </p>
            <button
              onClick={() => router.push('/discover')}
              className="bg-coral-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-coral-600 transition-colors"
            >
              Start discovering
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* New Matches */}
            {newMatches.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  New matches ({newMatches.length})
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {newMatches.map((match) => (
                    <button
                      key={match.id}
                      onClick={() => router.push(`/messages/${match.id}`)}
                      className="flex-shrink-0 text-center"
                    >
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-coral-500">
                          {match.otherUser.photo ? (
                            <img
                              src={match.otherUser.photo}
                              alt={match.otherUser.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-coral-100 flex items-center justify-center">
                              <span className="text-2xl">👤</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center">
                          <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-2 truncate w-20">
                        {match.otherUser.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversations */}
            {conversations.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Messages
                </h2>
                <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100">
                  {conversations.map((match) => (
                    <button
                      key={match.id}
                      onClick={() => router.push(`/messages/${match.id}`)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                        {match.otherUser.photo ? (
                          <img
                            src={match.otherUser.photo}
                            alt={match.otherUser.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-coral-100 flex items-center justify-center">
                            <span className="text-xl">👤</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            {match.otherUser.name}, {match.otherUser.age}
                          </h3>
                          {match.lastMessage && (
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(match.lastMessage.createdAt), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                        {match.lastMessage && (
                          <p className="text-sm text-gray-500 truncate">
                            {match.lastMessage.text}
                          </p>
                        )}
                      </div>
                      <MessageCircle className="w-5 h-5 text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
