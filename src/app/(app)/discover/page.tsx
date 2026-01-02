'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, X, Undo2, MessageCircle, MapPin, Briefcase, GraduationCap, Loader2 } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  position: number;
}

interface PromptAnswer {
  id: string;
  answer: string;
  prompt: {
    id: string;
    text: string;
  };
}

interface Profile {
  id: string;
  name: string;
  age: number;
  bio?: string;
  jobTitle?: string;
  company?: string;
  education?: string;
  height?: string;
  city?: string;
  distance?: number;
  photos: Photo[];
  promptAnswers: PromptAnswer[];
}

export default function DiscoverPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [likeTarget, setLikeTarget] = useState<{ type: 'photo' | 'prompt'; id: string } | null>(null);
  const [likeComment, setLikeComment] = useState('');
  const [matchModal, setMatchModal] = useState<{ name: string; photo?: string } | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/discovery');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = profiles[currentIndex];

  const handleSkip = async () => {
    if (!currentProfile) return;
    
    await fetch('/api/skip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skippedId: currentProfile.id }),
    });
    
    nextProfile();
  };

  const handleUndo = async () => {
    const res = await fetch('/api/skip', { method: 'DELETE' });
    const data = await res.json();
    if (data.undoneSkipId && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const openLikeModal = (type: 'photo' | 'prompt', id: string) => {
    setLikeTarget({ type, id });
    setLikeComment('');
    setShowLikeModal(true);
  };

  const handleLike = async () => {
    if (!currentProfile || !likeTarget) return;
    
    setLiking(true);
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: currentProfile.id,
          targetType: likeTarget.type,
          photoId: likeTarget.type === 'photo' ? likeTarget.id : undefined,
          promptAnswerId: likeTarget.type === 'prompt' ? likeTarget.id : undefined,
          comment: likeComment || undefined,
        }),
      });

      const data = await res.json();
      
      if (data.isMatch) {
        setMatchModal({
          name: currentProfile.name,
          photo: currentProfile.photos[0]?.url,
        });
      }
      
      setShowLikeModal(false);
      nextProfile();
    } catch (error) {
      console.error('Like failed:', error);
    } finally {
      setLiking(false);
    }
  };

  const nextProfile = () => {
    setCurrentPhotoIndex(0);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setProfiles([]);
    }
  };

  const nextPhoto = () => {
    if (currentProfile && currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-coral-100 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-coral-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No more profiles</h1>
        <p className="text-gray-600 mb-6">Check back later for new people in your area</p>
        <button
          onClick={fetchProfiles}
          className="bg-coral-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-coral-600 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Profile Card */}
      <div className="max-w-lg mx-auto p-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Photo Section */}
          <div className="relative aspect-[3/4]">
            <img
              src={currentProfile.photos[currentPhotoIndex]?.url || '/placeholder.jpg'}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            
            {/* Photo Navigation */}
            <div className="absolute inset-0 flex">
              <button onClick={prevPhoto} className="w-1/2 h-full" />
              <button onClick={nextPhoto} className="w-1/2 h-full" />
            </div>
            
            {/* Photo Indicators */}
            <div className="absolute top-4 left-4 right-4 flex gap-1">
              {currentProfile.photos.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i === currentPhotoIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
            
            {/* Like Photo Button */}
            <button
              onClick={() => openLikeModal('photo', currentProfile.photos[currentPhotoIndex]?.id)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Heart className="w-6 h-6 text-coral-500" />
            </button>
            
            {/* Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Name & Info */}
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
              {currentProfile.city && (
                <p className="flex items-center gap-1 text-white/90">
                  <MapPin className="w-4 h-4" />
                  {currentProfile.city}
                  {currentProfile.distance && ` • ${Math.round(currentProfile.distance)} miles`}
                </p>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 space-y-4">
            {(currentProfile.jobTitle || currentProfile.company) && (
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-5 h-5" />
                <span>
                  {currentProfile.jobTitle}
                  {currentProfile.company && ` at ${currentProfile.company}`}
                </span>
              </div>
            )}
            
            {currentProfile.education && (
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-5 h-5" />
                <span>{currentProfile.education}</span>
              </div>
            )}

            {/* Prompts */}
            {currentProfile.promptAnswers.map((pa) => (
              <div key={pa.id} className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-medium text-coral-600 mb-1">{pa.prompt.text}</p>
                <p className="text-gray-900">{pa.answer}</p>
                <button
                  onClick={() => openLikeModal('prompt', pa.id)}
                  className="mt-3 flex items-center gap-2 text-coral-500 font-medium text-sm hover:text-coral-600"
                >
                  <Heart className="w-4 h-4" /> Like this answer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handleUndo}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Undo2 className="w-6 h-6" />
          </button>
          <button
            onClick={handleSkip}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={() => openLikeModal('photo', currentProfile.photos[0]?.id)}
            className="w-16 h-16 bg-coral-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-coral-600 transition-colors"
          >
            <Heart className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Like Modal */}
      {showLikeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Send a like to {currentProfile.name}
            </h2>
            <p className="text-gray-600 mb-4">
              Add a comment to stand out (optional)
            </p>
            <textarea
              value={likeComment}
              onChange={(e) => setLikeComment(e.target.value)}
              placeholder="Say something nice..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none resize-none"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-400 text-right mt-1">{likeComment.length}/200</p>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowLikeModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLike}
                disabled={liking}
                className="flex-1 py-3 rounded-xl bg-coral-500 text-white font-medium hover:bg-coral-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {liking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    Send like
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Modal */}
      {matchModal && (
        <div className="fixed inset-0 bg-coral-500 z-50 flex items-center justify-center p-6">
          <div className="text-center text-white">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold mb-4">It&apos;s a match!</h1>
            <p className="text-xl text-white/90 mb-8">
              You and {matchModal.name} liked each other
            </p>
            {matchModal.photo && (
              <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white">
                <img src={matchModal.photo} alt={matchModal.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/matches')}
                className="bg-white text-coral-500 px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Send a message
              </button>
              <button
                onClick={() => setMatchModal(null)}
                className="text-white/80 font-medium hover:text-white"
              >
                Keep browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
