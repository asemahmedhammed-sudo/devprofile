'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage({ params }: { params: { locale: string } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const isAr = params.locale === 'ar';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      // Redirect to locale-aware dashboard
      router.push(`/${params.locale}/dashboard`);
      router.refresh();
    }
  };

  return (
    <div
      className="min-h-screen bg-[#08080C] flex flex-col items-center justify-center p-4 font-sans text-gray-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-sm p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-2xl font-light tracking-wide text-white mb-2 text-center">
          {isAr ? 'بوابة الدخول' : 'Auth Gateway'}
        </h1>
        <p className="text-gray-500 text-xs text-center mb-6">
          {isAr ? 'لوحة إدارة المحتوى' : 'Content Management Dashboard'}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-2">
              {isAr ? 'البريد الإلكتروني' : 'Identifier'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#08080C] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors shadow-inner"
              placeholder="admin@domain.com"
              dir="ltr"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-2">
              {isAr ? 'كلمة المرور' : 'Passphrase'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#08080C] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors shadow-inner"
              placeholder="••••••••"
              dir="ltr"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-medium tracking-wide py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 mt-2"
          >
            {loading
              ? (isAr ? 'جارٍ التحقق...' : 'Authenticating...')
              : (isAr ? 'تسجيل الدخول' : 'Sign In')}
          </button>
        </form>
      </div>
    </div>
  );
}
