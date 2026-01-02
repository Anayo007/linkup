'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus, X, Loader2, Camera, MapPin } from 'lucide-react';

interface Prompt {
  id: string;
  text: string;
  category: string;
}

interface PromptAnswer {
  promptId: string;
  answer: string;
}

const STEPS = [
  { id: 'basics', title: 'The basics' },
  { id: 'photos', title: 'Your photos' },
  { id: 'prompts', title: 'Your prompts' },
  { id: 'details', title: 'More about you' },
  { id: 'preferences', title: 'Your preferences' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [interestedIn, setInterestedIn] = useState('');
  const [city, setCity] = useState('London');
  const [locationLat, setLocationLat] = useState<number | null>(51.5074);
  const [locationLng, setLocationLng] = useState<number | null>(-0.1278);
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  const [selectedPrompts, setSelectedPrompts] = useState<PromptAnswer[]>([]);
  const [showPromptPicker, setShowPromptPicker] = useState(false);
  const [editingPromptIndex, setEditingPromptIndex] = useState<number | null>(null);
  
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [education, setEducation] = useState('');
  const [height, setHeight] = useState('');
  const [religion, setReligion] = useState('');
  const [drinking, setDrinking] = useState('');
  const [smoking, setSmoking] = useState('');
  
  const [prefAgeMin, setPrefAgeMin] = useState(22);
  const [prefAgeMax, setPrefAgeMax] = useState(35);
  const [prefDistance, setPrefDistance] = useState(25);
  const [prefGender, setPrefGender] = useState('');

  useEffect(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => setPrompts(data.prompts || []))
      .catch(console.error);
  }, []);

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
        setPhotos([...photos, data.url]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const selectPrompt = (prompt: Prompt) => {
    if (editingPromptIndex !== null) {
      const updated = [...selectedPrompts];
      updated[editingPromptIndex] = { promptId: prompt.id, answer: '' };
      setSelectedPrompts(updated);
    } else if (selectedPrompts.length < 3) {
      setSelectedPrompts([...selectedPrompts, { promptId: prompt.id, answer: '' }]);
    }
    setShowPromptPicker(false);
    setEditingPromptIndex(null);
  };

  const updatePromptAnswer = (index: number, answer: string) => {
    const updated = [...selectedPrompts];
    updated[index].answer = answer;
    setSelectedPrompts(updated);
  };

  const removePrompt = (index: number) => {
    setSelectedPrompts(selectedPrompts.filter((_, i) => i !== index));
  };

  const getPromptText = (promptId: string) => {
    return prompts.find(p => p.id === promptId)?.text || '';
  };

  const canProceed = useCallback(() => {
    switch (step) {
      case 0: return name && dob && gender && interestedIn;
      case 1: return photos.length >= 3;
      case 2: return selectedPrompts.length === 3 && selectedPrompts.every(p => p.answer.length > 0);
      case 3: return true;
      case 4: return prefGender;
      default: return false;
    }
  }, [step, name, dob, gender, interestedIn, photos.length, selectedPrompts, prefGender]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, dob, gender, interestedIn, city, locationLat, locationLng,
          photos, promptAnswers: selectedPrompts,
          jobTitle, company, education, height, religion, drinking, smoking,
          prefAgeMin, prefAgeMax, prefDistance, prefGender,
        }),
      });

      if (res.ok) {
        router.push('/discover');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={prevStep} disabled={step === 0} className="p-2 disabled:opacity-30">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-4">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-coral-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">{STEPS[step].title}</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {step === 0 && (
          <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Let&apos;s start with the basics</h1>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                placeholder="Your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">You must be 18 or older</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {['man', 'woman', 'non-binary'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-3 px-4 rounded-xl border-2 font-medium capitalize transition-all ${
                      gender === g
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Interested in...</label>
              <div className="grid grid-cols-3 gap-2">
                {['men', 'women', 'everyone'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setInterestedIn(g)}
                    className={`py-3 px-4 rounded-xl border-2 font-medium capitalize transition-all ${
                      interestedIn === g
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                placeholder="London"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add your photos</h1>
              <p className="text-gray-600 mt-1">Add at least 3 photos to continue</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] relative">
                  {photos[i] ? (
                    <div className="relative w-full h-full">
                      <img
                        src={photos[i]}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className={`w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      i < 3 ? 'border-coral-300 bg-coral-50' : 'border-gray-200 bg-gray-50'
                    } hover:border-coral-400`}>
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
                          <span className="text-xs text-gray-500">
                            {i < 3 ? 'Required' : 'Optional'}
                          </span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 text-center">
              {photos.length}/6 photos • {Math.max(0, 3 - photos.length)} more required
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Answer 3 prompts</h1>
              <p className="text-gray-600 mt-1">Show your personality with thoughtful answers</p>
            </div>

            <div className="space-y-4">
              {selectedPrompts.map((sp, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <button
                      onClick={() => {
                        setEditingPromptIndex(i);
                        setShowPromptPicker(true);
                      }}
                      className="text-sm font-medium text-coral-600 hover:text-coral-700"
                    >
                      {getPromptText(sp.promptId)}
                    </button>
                    <button onClick={() => removePrompt(i)} className="text-gray-400 hover:text-red-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <textarea
                    value={sp.answer}
                    onChange={(e) => updatePromptAnswer(i, e.target.value)}
                    placeholder="Your answer..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none resize-none"
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{sp.answer.length}/300</p>
                </div>
              ))}

              {selectedPrompts.length < 3 && (
                <button
                  onClick={() => {
                    setEditingPromptIndex(null);
                    setShowPromptPicker(true);
                  }}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-coral-300 text-coral-600 font-medium flex items-center justify-center gap-2 hover:bg-coral-50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add a prompt ({3 - selectedPrompts.length} remaining)
                </button>
              )}
            </div>

            {/* Prompt Picker Modal */}
            {showPromptPicker && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
                <div className="bg-white w-full max-w-lg max-h-[80vh] rounded-t-3xl sm:rounded-3xl overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Choose a prompt</h2>
                    <button onClick={() => setShowPromptPicker(false)} className="p-2">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[60vh] p-4">
                    {['fun', 'values', 'lifestyle', 'relationship'].map((category) => (
                      <div key={category} className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{category}</h3>
                        <div className="space-y-2">
                          {prompts
                            .filter((p) => p.category === category)
                            .filter((p) => !selectedPrompts.some((sp) => sp.promptId === p.id))
                            .map((prompt) => (
                              <button
                                key={prompt.id}
                                onClick={() => selectPrompt(prompt)}
                                className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-coral-50 hover:text-coral-600 transition-colors"
                              >
                                {prompt.text}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">A bit more about you</h1>
              <p className="text-gray-600 mt-1">These are optional but help with matches</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                  placeholder="e.g. Google"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                  placeholder="e.g. University of London"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <select
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                >
                  <option value="">Prefer not to say</option>
                  {Array.from({ length: 50 }, (_, i) => 150 + i).map((h) => (
                    <option key={h} value={h}>{h} cm ({Math.floor(h / 30.48)}&apos;{Math.round((h % 30.48) / 2.54)}&quot;)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                >
                  <option value="">Prefer not to say</option>
                  {['Agnostic', 'Atheist', 'Buddhist', 'Catholic', 'Christian', 'Hindu', 'Jewish', 'Muslim', 'Sikh', 'Spiritual', 'Other'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drinking</label>
                  <select
                    value={drinking}
                    onChange={(e) => setDrinking(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                  >
                    <option value="">Prefer not to say</option>
                    {['Never', 'Rarely', 'Socially', 'Regularly'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Smoking</label>
                  <select
                    value={smoking}
                    onChange={(e) => setSmoking(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                  >
                    <option value="">Prefer not to say</option>
                    {['Never', 'Socially', 'Regularly'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your preferences</h1>
              <p className="text-gray-600 mt-1">Who would you like to meet?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Show me...</label>
                <div className="grid grid-cols-3 gap-2">
                  {['men', 'women', 'everyone'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPrefGender(g)}
                      className={`py-3 px-4 rounded-xl border-2 font-medium capitalize transition-all ${
                        prefGender === g
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
                  Age range: {prefAgeMin} - {prefAgeMax}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={prefAgeMin}
                    onChange={(e) => setPrefAgeMin(Math.min(Number(e.target.value), prefAgeMax - 1))}
                    className="flex-1 accent-coral-500"
                  />
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={prefAgeMax}
                    onChange={(e) => setPrefAgeMax(Math.max(Number(e.target.value), prefAgeMin + 1))}
                    className="flex-1 accent-coral-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum distance: {prefDistance} miles
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={prefDistance}
                  onChange={(e) => setPrefDistance(Number(e.target.value))}
                  className="w-full accent-coral-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 safe-area-bottom">
        <button
          onClick={nextStep}
          disabled={!canProceed() || loading}
          className="w-full bg-coral-500 text-white py-4 rounded-xl font-semibold hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {step === STEPS.length - 1 ? (loading ? 'Saving...' : 'Complete profile') : 'Continue'}
          {!loading && step < STEPS.length - 1 && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
