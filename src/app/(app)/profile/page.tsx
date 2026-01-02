'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Edit2, Camera, Plus, X, Loader2, MapPin, Briefcase, GraduationCap, LogOut } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  position: number;
}

interface PromptAnswer {
  id: string;
  answer: string;
  promptId: string;
  prompt: {
    id: string;
    text: string;
  };
}

interface Profile {
  name: string;
  dob: string;
  gender: string;
  interestedIn: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  education?: string;
  height?: string;
  city?: string;
  religion?: string;
  drinking?: string;
  smoking?: string;
}

interface Prompt {
  id: string;
  text: string;
  category: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [promptAnswers, setPromptAnswers] = useState<PromptAnswer[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Edit state
  const [editBio, setEditBio] = useState('');
  const [editJobTitle, setEditJobTitle] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editEducation, setEditEducation] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchPrompts();
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
      setPhotos(data.photos || []);
      setPromptAnswers(data.promptAnswers || []);
      
      if (data.profile) {
        setEditBio(data.profile.bio || '');
        setEditJobTitle(data.profile.jobTitle || '');
        setEditCompany(data.profile.company || '');
        setEditEducation(data.profile.education || '');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrompts = async () => {
    try {
      const res = await fetch('/api/prompts');
      const data = await res.json();
      setPrompts(data.prompts || []);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        const newPhotos = [...photos, { id: Date.now().toString(), url: data.url, position: photos.length }];
        setPhotos(newPhotos);
        await savePhotos(newPhotos);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = async (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    await savePhotos(newPhotos);
  };

  const savePhotos = async (newPhotos: Photo[]) => {
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          photos: newPhotos.map(p => p.url),
          promptAnswers: promptAnswers.map(pa => ({ promptId: pa.promptId, answer: pa.answer })),
        }),
      });
    } catch (error) {
      console.error('Failed to save photos:', error);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: editBio,
          jobTitle: editJobTitle,
          company: editCompany,
          education: editEducation,
        }),
      });
      setProfile(prev => prev ? {
        ...prev,
        bio: editBio,
        jobTitle: editJobTitle,
        company: editCompany,
        education: editEducation,
      } : null);
      setEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Profile not found</h1>
          <button
            onClick={() => router.push('/onboarding')}
            className="text-coral-500 font-medium"
          >
            Complete your profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Edit profile"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              router.push('/');
            }}
            className="p-2 text-gray-500 hover:text-red-500"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Photos */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Photos</h2>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <div key={photo.id} className="aspect-[3/4] relative">
                <img
                  src={photo.url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                {editing && (
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {photos.length < 6 && (
              <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-coral-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhoto}
                />
                {uploadingPhoto ? (
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">
            {profile.name}, {calculateAge(profile.dob)}
          </h2>
          
          {profile.city && (
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{profile.city}</span>
            </div>
          )}

          {editing ? (
            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job title</label>
                <input
                  type="text"
                  value={editJobTitle}
                  onChange={(e) => setEditJobTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-coral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-coral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input
                  type="text"
                  value={editEducation}
                  onChange={(e) => setEditEducation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-coral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-coral-500 outline-none resize-none"
                  rows={3}
                  maxLength={500}
                />
              </div>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="w-full py-3 bg-coral-500 text-white rounded-xl font-medium hover:bg-coral-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save changes
              </button>
            </div>
          ) : (
            <>
              {(profile.jobTitle || profile.company) && (
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span>
                    {profile.jobTitle}
                    {profile.company && ` at ${profile.company}`}
                  </span>
                </div>
              )}
              {profile.education && (
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>{profile.education}</span>
                </div>
              )}
              {profile.bio && (
                <p className="text-gray-600 mt-3">{profile.bio}</p>
              )}
            </>
          )}
        </div>

        {/* Prompts */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Prompts</h2>
          <div className="space-y-3">
            {promptAnswers.map((pa) => (
              <div key={pa.id} className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-coral-600 mb-1">{pa.prompt.text}</p>
                <p className="text-gray-900">{pa.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Details</h2>
          <div className="grid grid-cols-2 gap-3">
            {profile.height && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Height</p>
                <p className="font-medium">{profile.height} cm</p>
              </div>
            )}
            {profile.religion && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Religion</p>
                <p className="font-medium">{profile.religion}</p>
              </div>
            )}
            {profile.drinking && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Drinking</p>
                <p className="font-medium">{profile.drinking}</p>
              </div>
            )}
            {profile.smoking && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Smoking</p>
                <p className="font-medium">{profile.smoking}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
