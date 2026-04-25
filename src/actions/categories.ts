'use server';

import { revalidatePath } from 'next/cache';
import { createSSRSupabase } from '@/lib/supabase';
import { categorySchema, type CategoryFormValues } from '@/lib/validations/category';

export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

async function getAuthUser() {
  const supabase = await createSSRSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

function revalidate() {
  // Revalidate the categories page and all sections that use categories
  revalidatePath('/dashboard/categories');
  revalidatePath('/dashboard/skills');
  revalidatePath('/dashboard/projects');
  revalidatePath('/dashboard/experience');
}

export async function upsertCategory(raw: CategoryFormValues): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Validation failed' };
  }

  const { supabase, user } = await getAuthUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { id, ...fields } = parsed.data;

  const payload = {
    name_en: fields.name_en,
    name_ar: fields.name_ar,
    section: fields.section,
  };

  if (id) {
    const { error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidate();
    return { success: true, id };
  }

  const { data, error } = await supabase
    .from('categories')
    .insert(payload)
    .select('id')
    .single();

  if (error || !data) return { success: false, error: error?.message ?? 'Insert failed' };
  revalidate();
  return { success: true, id: data.id };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const { supabase, user } = await getAuthUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidate();
  return { success: true, id };
}
