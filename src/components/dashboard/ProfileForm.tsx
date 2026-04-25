'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile, type ProfileFormValues } from '@/actions/profile';
import { createClient } from '@/lib/supabase/client';

// ─── Schema (mirrored client-side for RHF resolver) ───────────────────────────

const profileSchema = z.object({
  full_name_en: z.string().min(2, 'English name required'),
  full_name_ar: z.string().optional().default(''),
  role_en:      z.string().min(2, 'English role required'),
  role_ar:      z.string().optional().default(''),
  tagline_en:   z.string().optional().default(''),
  tagline_ar:   z.string().optional().default(''),
  bio_en:       z.string().optional().default(''),
  bio_ar:       z.string().optional().default(''),
  location_en:  z.string().optional().default(''),
  location_ar:  z.string().optional().default(''),
  avatar_url:   z.string().optional().default(''),
  github_url:   z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  email:        z.string().email('Must be a valid email').optional().or(z.literal('')),
  open_to_work: z.boolean().optional().default(false),
});

// ─── Toast ────────────────────────────────────────────────────────────────────

type ToastState = { type: 'success' | 'error'; message: string } | null;

function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div className={[
      'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl',
      'border backdrop-blur-lg text-sm font-medium animate-in slide-in-from-bottom-4 duration-300',
      ok ? 'bg-white/10 border-white/15 text-green-300' : 'bg-white/10 border-white/15 text-red-400',
    ].join(' ')}>
      <span>{ok ? '✓' : '✕'}</span>
      <span>{toast.message}</span>
      <button onClick={onDismiss} className="ms-2 opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

// ─── Input primitives ─────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 ' +
  'text-white placeholder-gray-600 text-sm ' +
  'focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all duration-200';

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">{children}</span>;
}

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-400 mt-1">{msg}</p> : null;
}

// ─── Avatar Upload ────────────────────────────────────────────────────────────

function AvatarUpload({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `avatars/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  }

  return (
    <div className="flex items-center gap-5">
      <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 bg-white/5 shrink-0 flex items-center justify-center text-gray-600 text-lg font-light">
        {value
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={value} alt="Avatar" className="w-full h-full object-cover" />
          : '?'
        }
      </div>
      <label className="cursor-pointer px-4 py-2 rounded-lg border border-dashed border-white/15 text-gray-400 text-sm hover:border-white/25 hover:text-gray-200 transition-all">
        {uploading ? 'Uploading…' : 'Upload Photo'}
        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
      </label>
    </div>
  );
}

// ─── Profile Form ─────────────────────────────────────────────────────────────

interface ProfileFormProps {
  defaults: ProfileFormValues;
}

export default function ProfileForm({ defaults }: ProfileFormProps) {
  const [toast, setToast] = useState<ToastState>(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      mode: 'onBlur',
      defaultValues: defaults,
    });

  const avatarUrl = watch('avatar_url');

  function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      const result = await updateProfile(data);
      if (result.success) {
        setToast({ type: 'success', message: 'Profile saved — public pages updated.' });
      } else {
        setToast({ type: 'error', message: result.error });
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>

        {/* ── Avatar ── */}
        <section className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Photo</h3>
          <AvatarUpload
            value={avatarUrl}
            onChange={(url) => setValue('avatar_url', url, { shouldValidate: true })}
          />
        </section>

        {/* ── Identity — split EN / AR ── */}
        <section className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Identity</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* English column */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="ltr">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">🇺🇸 English</p>

              <div>
                <Label>Full Name (EN)</Label>
                <input className={inputCls} placeholder="e.g. Asem Ahmed" {...register('full_name_en')} />
                <Err msg={errors.full_name_en?.message} />
              </div>

              <div>
                <Label>Job Title (EN)</Label>
                <input className={inputCls} placeholder="e.g. Senior Software Engineer" {...register('role_en')} />
                <Err msg={errors.role_en?.message} />
              </div>

              <div>
                <Label>Tagline (EN)</Label>
                <input className={inputCls} placeholder="One line that captures you" {...register('tagline_en')} />
              </div>

              <div>
                <Label>Bio (EN)</Label>
                <textarea rows={4} className={inputCls + ' resize-none'} placeholder="Short about paragraph…" {...register('bio_en')} />
              </div>

              <div>
                <Label>Location (EN)</Label>
                <input className={inputCls} placeholder="e.g. Cairo, Egypt" {...register('location_en')} />
              </div>
            </div>

            {/* Arabic column */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="rtl">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">🇸🇦 العربية</p>

              <div>
                <Label>الاسم الكامل (AR)</Label>
                <input className={inputCls} placeholder="مثال: عاصم أحمد" {...register('full_name_ar')} />
                <Err msg={errors.full_name_ar?.message} />
              </div>

              <div>
                <Label>المسمى الوظيفي (AR)</Label>
                <input className={inputCls} placeholder="مثال: مهندس برمجيات أول" {...register('role_ar')} />
                <Err msg={errors.role_ar?.message} />
              </div>

              <div>
                <Label>الشعار (AR)</Label>
                <input className={inputCls} placeholder="جملة تعبّر عنك" {...register('tagline_ar')} />
              </div>

              <div>
                <Label>نبذة (AR)</Label>
                <textarea rows={4} className={inputCls + ' resize-none'} placeholder="نبذة قصيرة…" {...register('bio_ar')} />
              </div>

              <div>
                <Label>الموقع (AR)</Label>
                <input className={inputCls} placeholder="مثال: القاهرة، مصر" {...register('location_ar')} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact & Social ── */}
        <section className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="ltr">
          <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Contact & Social</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Email</Label>
              <input type="email" className={inputCls} placeholder="you@example.com" {...register('email')} />
              <Err msg={errors.email?.message} />
            </div>
            <div>
              <Label>GitHub URL</Label>
              <input type="url" className={inputCls} placeholder="https://github.com/…" {...register('github_url')} />
              <Err msg={errors.github_url?.message} />
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <input type="url" className={inputCls} placeholder="https://linkedin.com/in/…" {...register('linkedin_url')} />
              <Err msg={errors.linkedin_url?.message} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="open_to_work"
              className="w-4 h-4 rounded accent-white"
              {...register('open_to_work')}
            />
            <label htmlFor="open_to_work" className="text-sm text-gray-300 cursor-pointer">
              Open to work — show badge on portfolio
            </label>
          </div>
        </section>

        {/* ── Submit ── */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-2.5 bg-white text-black font-medium text-sm rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
