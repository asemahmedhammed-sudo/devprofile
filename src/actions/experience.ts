'use server';

import { revalidatePath } from 'next/cache';
import { createSSRSupabase } from '@/lib/supabase';
import { experienceSchema, type ExperienceFormValues } from '@/lib/validations/experience';

export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

async function getAuthProfile() {
  const supabase = await createSSRSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single();

  return { supabase, user, profile };
}

function revalidate() {
  revalidatePath('/en');
  revalidatePath('/ar');
  revalidatePath('/dashboard/experience');
}

export async function upsertExperience(raw: ExperienceFormValues): Promise<ActionResult> {
  const parsed = experienceSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Validation failed' };
  }

  const { supabase, user, profile } = await getAuthProfile();
  if (!user || !profile) return { success: false, error: 'Unauthenticated' };

  const { id, ...fields } = parsed.data;

  const payload = {
    profile_id:      profile.id,
    company_en:      fields.company_en,
    company_ar:      fields.company_ar || null,
    company_url:     fields.company_url || null,
    position_en:     fields.position_en,
    position_ar:     fields.position_ar || null,
    description_en:  fields.description_en || null,
    description_ar:  fields.description_ar || null,
    employment_type: fields.employment_type || 'Full-time',
    start_date:      fields.start_date.length === 7 ? `${fields.start_date}-01` : fields.start_date,
    // null in DB = current/present role
    end_date:        fields.is_current ? null : (fields.end_date ? (fields.end_date.length === 7 ? `${fields.end_date}-01` : fields.end_date) : null),
  };

  if (id) {
    const { error } = await supabase
      .from('experience')
      .update(payload)
      .eq('id', id)
      .eq('profile_id', profile.id);

    if (error) return { success: false, error: error.message };
    revalidate();
    return { success: true, id };
  }

  const { data, error } = await supabase
    .from('experience')
    .insert(payload)
    .select('id')
    .single();

  if (error || !data) return { success: false, error: error?.message ?? 'Insert failed' };
  revalidate();
  return { success: true, id: data.id };
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  const { supabase, user, profile } = await getAuthProfile();
  if (!user || !profile) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('experience')
    .delete()
    .eq('id', id)
    .eq('profile_id', profile.id);

  if (error) return { success: false, error: error.message };
  revalidate();
  return { success: true, id };
}
