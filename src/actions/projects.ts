'use server';

import { createSSRSupabase } from '@/lib/supabase';
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project';
import { revalidatePath } from 'next/cache';

export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function upsertProject(raw: ProjectFormValues): Promise<ActionResult> {
  // 1. Validate
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Validation failed' };
  }

  const { id, tech_stack, live_link, github_link, image_url, ...fields } = parsed.data;

  // Normalise tech_stack: comma-separated string → array
  const techArray = tech_stack
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const supabase = await createSSRSupabase();

  // 2. Auth guard — only authenticated admin may write
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthenticated' };

  // 3. Fetch profile_id for this admin user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!profile) return { success: false, error: 'Profile not found for this user' };

  // 4. Upsert
  const payload = {
    profile_id: profile.id,
    title_en: fields.title_en,
    title_ar: fields.title_ar,
    description_en: fields.description_en,
    description_ar: fields.description_ar,
    tech_stack: techArray,
    category: fields.category || null,
    live_link: live_link || null,
    github_link: github_link || null,
    image_url: image_url || null,
  };

  if (id) {
    // UPDATE — verify ownership
    const { error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .eq('profile_id', profile.id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/[locale]/(public)', 'page');
    return { success: true, id };
  } else {
    // INSERT
    const { data, error } = await supabase
      .from('projects')
      .insert(payload)
      .select('id')
      .single();

    if (error || !data) return { success: false, error: error?.message ?? 'Insert failed' };
    revalidatePath('/[locale]/(public)', 'page');
    return { success: true, id: data.id };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const supabase = await createSSRSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/[locale]/(public)', 'page');
  return { success: true, id };
}
