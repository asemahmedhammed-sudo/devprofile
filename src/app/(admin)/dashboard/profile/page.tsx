import { createSSRSupabase } from '@/lib/supabase/server';
import ProfileForm from '@/components/dashboard/ProfileForm';
import type { ProfileFormValues } from '@/actions/profile';

export const dynamic = 'force-dynamic';

async function fetchProfileDefaults(): Promise<ProfileFormValues> {
  const supabase = await createSSRSupabase();
  const { data } = await supabase.from('profiles').select('*').limit(1).single();

  // Extract social links
  const social = (data?.social_links as { platform: string; url: string }[]) ?? [];
  const github   = social.find((s) => s.platform === 'github')?.url ?? '';
  const linkedin = social.find((s) => s.platform === 'linkedin')?.url ?? '';
  const emailRaw = social.find((s) => s.platform === 'email')?.url ?? '';
  const email    = emailRaw.replace('mailto:', '');

  return {
    full_name_en: data?.full_name_en ?? '',
    full_name_ar: data?.full_name_ar ?? '',
    role_en:      data?.role_en      ?? '',
    role_ar:      data?.role_ar      ?? '',
    tagline_en:   data?.tagline_en   ?? '',
    tagline_ar:   data?.tagline_ar   ?? '',
    bio_en:       data?.bio_en       ?? '',
    bio_ar:       data?.bio_ar       ?? '',
    location_en:  data?.location_en  ?? '',
    location_ar:  data?.location_ar  ?? '',
    avatar_url:   data?.avatar_url   ?? '',
    github_url:   github,
    linkedin_url: linkedin,
    email,
    open_to_work: false,
  };
}

export default async function DashboardProfilePage() {
  const defaults = await fetchProfileDefaults();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-light tracking-wide text-white mb-2">Profile</h2>
        <p className="text-gray-400 leading-relaxed font-light">
          Update your public identity. Changes take effect immediately on the live portfolio.
        </p>
      </header>

      <ProfileForm defaults={defaults} />
    </div>
  );
}
