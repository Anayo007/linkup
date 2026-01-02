'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Pause, Play, Trash2, LogOut, Shield, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Profile {
  prefAgeMin: number;
  prefAgeMax: number;
  prefDistance: number;
  prefGender: string;
  isHidden: boolean;
  isPaused: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setProfile(data.profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    
    try {
      // In a real app, this would call a delete account endpoint
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Discovery Preferences */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Discovery preferences</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show me
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['men', 'women', 'everyone'].map((g) => (
                  <button
                    key={g}
                    onClick={() => updateProfile({ prefGender: g })}
                    className={`py-2 px-3 rounded-xl border-2 font-medium capitalize text-sm transition-all ${
                      profile?.prefGender === g
                        ? 'border-coral-500 bg-coral-50 text-coral-600'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age range: {profile?.prefAgeMin} - {profile?.prefAgeMax}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="18"
                  max="60"
                  value={profile?.prefAgeMin || 18}
                  onChange={(e) => updateProfile({ prefAgeMin: Math.min(Number(e.target.value), (profile?.prefAgeMax || 50) - 1) })}
                  className="flex-1 accent-coral-500"
                />
                <input
                  type="range"
                  min="18"
                  max="60"
                  value={profile?.prefAgeMax || 50}
                  onChange={(e) => updateProfile({ prefAgeMax: Math.max(Number(e.target.value), (profile?.prefAgeMin || 18) + 1) })}
                  className="flex-1 accent-coral-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum distance: {profile?.prefDistance} miles
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={profile?.prefDistance || 25}
                onChange={(e) => updateProfile({ prefDistance: Number(e.target.value) })}
                className="w-full accent-coral-500"
              />
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <h2 className="font-semibold text-gray-900 p-4 pb-2">Privacy</h2>
          
          <button
            onClick={() => updateProfile({ isHidden: !profile?.isHidden })}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {profile?.isHidden ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              <div className="text-left">
                <p className="font-medium text-gray-900">Hide profile</p>
                <p className="text-sm text-gray-500">Your profile won&apos;t appear in discovery</p>
              </div>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors ${profile?.isHidden ? 'bg-coral-500' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow mt-1 transition-transform ${profile?.isHidden ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </button>

          <button
            onClick={() => updateProfile({ isPaused: !profile?.isPaused })}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 border-t border-gray-100"
          >
            <div className="flex items-center gap-3">
              {profile?.isPaused ? <Pause className="w-5 h-5 text-gray-500" /> : <Play className="w-5 h-5 text-gray-500" />}
              <div className="text-left">
                <p className="font-medium text-gray-900">Pause account</p>
                <p className="text-sm text-gray-500">Take a break from dating</p>
              </div>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors ${profile?.isPaused ? 'bg-coral-500' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow mt-1 transition-transform ${profile?.isPaused ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </button>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <h2 className="font-semibold text-gray-900 p-4 pb-2">Resources</h2>
          
          <Link href="/safety" className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">Dating safety tips</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/guidelines" className="w-full p-4 flex items-center justify-between hover:bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">Community guidelines</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Account */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <h2 className="font-semibold text-gray-900 p-4 pb-2">Account</h2>
          
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-gray-900"
          >
            <LogOut className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Log out</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full p-4 flex items-center gap-3 hover:bg-red-50 text-red-600 border-t border-gray-100"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Delete account</span>
          </button>
        </div>

        {saving && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete your account?</h2>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. All your data, matches, and messages will be permanently deleted.
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 outline-none mb-4"
              placeholder="DELETE"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
