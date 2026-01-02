'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Lock, Crown, Loader2, MessageCircle, Sparkles } from 'lucide-react';

interface LikeData {
  id: string;
  comment?: string;
  createdAt: string;
  targetType: string;
  fromUser: {
    id: string;
    subscriptionTier: string;
    profile: {
      name: string;
      city?: string;
    };
    photos: { url: string }[];
  };
  photo?: { url: string };
  promptAnswer?: {
    answer: string;
    prompt: { text: string };
  };
}

interface UserData {
  subscriptionTier: string;
}

export default function LikesPage() {
  const router = useRouter();
  const [likes, setLikes] = useState<LikeData[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [likesRes, userRes] = await Promise.all([
        fetch('/api/likes'),
        fetch('/api/auth/me'),
      ]);

      if (likesRes.status === 401 || userRes.status === 401) {
        router.push('/login');
        return;
      }

      const likesData = await likesRes.json();
      const userData = await userRes.json();

      setLikes(likesData.likes || []);
      setUser(userData.user);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeBack = async (userId: string) => {
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: userId,
          targetType: 'photo',
          photoId: null,
        }),
      });

      const data = await res.json();
      
      if (data.isMatch) {
        router.push('/matches');
      } else {
        // Remove from likes list
        setLikes(likes.filter(l => l.fromUser.id !== userId));
      }
    } catch (error) {
      console.error('Like back failed:', error);
    }
  };

  const isPremium = user?.subscriptionTier === 'plus' || user?.subscriptionTier === 'premium';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-coral-500" />
            Likes You
            {likes.length > 0 && (
              <span className="bg-coral-500 text-white text-sm px-2 py-0.5 rounded-full">
                {likes.length}
              </span>
            )}
          </h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4">
        {/* Upgrade Banner for Free Users */}
        {!isPremium && likes.length > 0 && (
          <div className="bg-gradient-to-r from-coral-500 to-orange-500 rounded-2xl p-5 mb-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">See who likes you</h3>
                <p className="text-white/90 text-sm mb-3">
                  Upgrade to LinkUp+ to see clear photos and match instantly with people who already like you.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-white text-coral-500 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Upgrade now
                </Link>
              </div>
            </div>
          </div>
        )}

        {likes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-coral-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No likes yet</h2>
            <p className="text-gray-600 mb-6">
              When someone likes your profile, they&apos;ll appear here
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 bg-coral-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-coral-600 transition-colors"
            >
              Start discovering
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {likes.map((like) => (
              <div
                key={like.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              >
                {/* Photo */}
                <div className="relative aspect-[3/4]">
                  <img
                    src={like.fromUser.photos[0]?.url || '/placeholder.jpg'}
                    alt={isPremium ? like.fromUser.profile.name : 'Someone'}
                    className={`w-full h-full object-cover ${!isPremium ? 'blur-xl' : ''}`}
                  />
                  
                  {/* Blur overlay for free users */}
                  {!isPremium && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <Lock className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  )}

                  {/* Gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Name */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-semibold truncate">
                      {isPremium ? like.fromUser.profile.name : '???'}
                    </p>
                    {isPremium && like.fromUser.profile.city && (
                      <p className="text-white/80 text-xs truncate">
                        {like.fromUser.profile.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* What they liked */}
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Liked your {like.targetType === 'photo' ? 'photo' : 'prompt'}
                  </p>
                  
                  {like.comment && isPremium && (
                    <div className="bg-coral-50 rounded-lg p-2 mb-2">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        &ldquo;{like.comment}&rdquo;
                      </p>
                    </div>
                  )}

                  {isPremium ? (
                    <button
                      onClick={() => handleLikeBack(like.fromUser.id)}
                      className="w-full bg-coral-500 text-white py-2 rounded-lg font-medium text-sm hover:bg-coral-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <Heart className="w-4 h-4" />
                      Like back
                    </button>
                  ) : (
                    <Link
                      href="/pricing"
                      className="block w-full bg-gray-100 text-gray-600 py-2 rounded-lg font-medium text-sm text-center hover:bg-gray-200 transition-colors"
                    >
                      Upgrade to see
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
