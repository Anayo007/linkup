'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUserPusher } from '@/hooks/usePusher';
import { useRouter } from 'next/navigation';

interface MatchNotification {
  matchId: string;
  userName: string;
  userPhoto: string;
}

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>('');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchNotification, setMatchNotification] = useState<MatchNotification | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get current user ID
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUserId(data.user.id);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleNewMatch = useCallback((data: MatchNotification) => {
    setMatchNotification(data);
    setShowMatchModal(true);
    
    // Play a sound (optional)
    try {
      const audio = new Audio('/sounds/match.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  const handleNewMessage = useCallback((data: { matchId: string; message: { senderName?: string; text: string } }) => {
    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(`New message from ${data.message.senderName || 'Someone'}`, {
        body: data.message.text.substring(0, 100),
        icon: '/icons/icon-192x192.png',
      });
    }
  }, []);

  // Subscribe to user's personal channel
  useUserPusher({
    userId,
    onNewMatch: handleNewMatch,
    onNewMessage: handleNewMessage,
  });

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <>
      {children}

      {/* Match Celebration Modal */}
      {showMatchModal && matchNotification && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-coral-500 to-pink-500 rounded-3xl p-8 max-w-sm w-full text-center animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">It&apos;s a Match!</h2>
            <p className="text-white/90 mb-6">
              You and {matchNotification.userName} liked each other!
            </p>
            
            {matchNotification.userPhoto && (
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={matchNotification.userPhoto}
                  alt={matchNotification.userName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowMatchModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
              >
                Keep swiping
              </button>
              <button
                onClick={() => {
                  setShowMatchModal(false);
                  router.push(`/messages/${matchNotification.matchId}`);
                }}
                className="flex-1 py-3 rounded-xl bg-white text-coral-500 font-medium hover:bg-gray-100 transition-colors"
              >
                Send message
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
