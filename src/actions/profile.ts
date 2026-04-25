'use server';

import { revalidatePath } from 'next/cache';
import { createSSRSupabase } from '@/lib/supabase/server';
import { z } from 'zod';

// ─── Validation Schema ─────────────────────────────────────────────────────────

const profileSchema = z.object({
  full_name_en: z.string().min(2, 'English name must be at least 2 characters'),
  full_name_ar: z.string().optional().default(''),
  role_en:      z.string().min(2, 'English role is required'),
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

export type ProfileFormValues = z.infer<typeof profileSchema>;

// ─── Action ───────────────────────────────────────────────────────────────────

export async function updateProfile(
  values: ProfileFormValues
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabase = await createSSRSupabase();

    // Auth guard
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const parsed = profileSchema.safeParse(values);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Validation failed';
      return { success: false, error: firstError };
    }

    const v = parsed.data;

    // Build social_links JSON from individual URL fields
    const social_links = [
      v.github_url   ? { platform: 'github',   url: v.github_url,   label: 'GitHub' }   : null,
      v.linkedin_url ? { platform: 'linkedin', url: v.linkedin_url, label: 'LinkedIn' } : null,
      v.email        ? { platform: 'email',    url: `mailto:${v.email}`, label: 'Email' } : null,
    ].filter(Boolean);

    const payload = {
      full_name_en: v.full_name_en,
      full_name_ar: v.full_name_ar,
      role_en:      v.role_en,
      role_ar:      v.role_ar,
      tagline_en:   v.tagline_en,
      tagline_ar:   v.tagline_ar,
      bio_en:       v.bio_en,
      bio_ar:       v.bio_ar,
      location_en:  v.location_en,
      location_ar:  v.location_ar,
      avatar_url:   v.avatar_url,
      open_to_work: v.open_to_work ?? false,
      social_links,
    };

    // Upsert — we always have exactly one profile row
    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id);

    if (error) {
      // Fallback: update without filtering by user id (single-row profile table)
      const { error: fallbackError } = await supabase
        .from('profiles')
        .update(payload)
        .limit(1);

      if (fallbackError) return { success: false, error: fallbackError.message };
    }

    // Revalidate the public portfolio pages
    revalidatePath('/en');
    revalidatePath('/ar');
    revalidatePath('/dashboard/profile');

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}
