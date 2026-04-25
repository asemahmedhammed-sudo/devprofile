'use server';

import { revalidatePath } from 'next/cache';
import { createSSRSupabase } from '@/lib/supabase';
import { skillSchema, type SkillFormValues } from '@/lib/validations/skill';

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
  revalidatePath('/dashboard/skills');
}

export async function upsertSkill(raw: SkillFormValues): Promise<ActionResult> {
  const parsed = skillSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Validation failed' };
  }

  const { supabase, user, profile } = await getAuthProfile();
  if (!user || !profile) return { success: false, error: 'Unauthenticated' };

  const { id, ...fields } = parsed.data;

  const payload = {
    profile_id:        profile.id,
    name_en:           fields.name_en,
    name_ar:           fields.name_ar || null,
    category_en:       fields.category_en || null,
    category_ar:       fields.category_ar || null,
    proficiency_level: fields.proficiency_level,
  };

  if (id) {
    const { error } = await supabase
      .from('skills')
      .update(payload)
      .eq('id', id)
      .eq('profile_id', profile.id);

    if (error) return { success: false, error: error.message };
    revalidate();
    return { success: true, id };
  }

  const { data, error } = await supabase
    .from('skills')
    .insert(payload)
    .select('id')
    .single();

  if (error || !data) return { success: false, error: error?.message ?? 'Insert failed' };
  revalidate();
  return { success: true, id: data.id };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  const { supabase, user, profile } = await getAuthProfile();
  if (!user || !profile) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)
    .eq('profile_id', profile.id);

  if (error) return { success: false, error: error.message };
  revalidate();
  return { success: true, id };
}
