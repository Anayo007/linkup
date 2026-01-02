'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Check, RefreshCw } from 'lucide-react';

// Generate a simple math question
function generateMathQuestion() {
  const operations = ['+', '-', '×'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1: number, num2: number, answer: number;

  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 10) + 5;
      num2 = Math.floor(Math.random() * num1);
      answer = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      answer = num1 * num2;
      break;
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
  }

  return { question: `${num1} ${operation} ${num2}`, answer };
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Math captcha state
  const [mathQuestion, setMathQuestion] = useState({ question: '', answer: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  useEffect(() => {
    setMathQuestion(generateMathQuestion());
  }, []);

  const refreshCaptcha = () => {
    setMathQuestion(generateMathQuestion());
    setCaptchaAnswer('');
  };

  const passwordRequirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordRequirements.every(r => r.met)) {
      setError('Please meet all password requirements');
      return;
    }

    // Verify captcha
    if (parseInt(captchaAnswer) !== mathQuestion.answer) {
      setError('Incorrect answer to the math question. Please try again.');
      refreshCaptcha();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent">
            LinkUp
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600 mb-8">Start your journey to meaningful connections</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm ${req.met ? 'text-green-600' : 'text-gray-400'}`}>
                    <Check className={`w-4 h-4 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                    {req.text}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Math Captcha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verify you&apos;re human
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gradient-to-r from-coral-50 to-orange-50 border border-coral-200 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">
                    {mathQuestion.question} = ?
                  </span>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-1 text-coral-500 hover:text-coral-600 hover:bg-coral-100 rounded-lg transition-colors"
                    title="Get a new question"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="number"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-24 px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all text-center text-lg font-semibold"
                  placeholder="?"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coral-500 text-white py-3 rounded-xl font-semibold hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-coral-500 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-coral-500 hover:underline">Privacy Policy</Link>
            </p>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-coral-500 font-medium hover:text-coral-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
