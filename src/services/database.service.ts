import { createSSRSupabase } from '@/lib/supabase';
import { ProfileData, Project, WorkExperience, Skill, Locale } from '@/types';

/**
 * Service Layer: maps bilingual DB DTOs to typed UI interfaces resolved for the active locale.
 * All functions accept `locale` and return the correct _en / _ar variant under a generic key.
 * Used exclusively in Server Components/Actions.
 */

export async function getProfile(locale: Locale): Promise<ProfileData | null> {
  const supabase = await createSSRSupabase();
  const { data, error } = await supabase.from('profiles').select('*').single();

  if (error || !data) return null;

  return {
    full_name_en: data.full_name_en ?? '',
    full_name_ar: data.full_name_ar ?? '',
    // Resolved for current locale — convenience accessor used by components
    name: locale === 'ar' ? (data.full_name_ar ?? data.full_name_en ?? '') : (data.full_name_en ?? ''),
    role_en: data.role_en ?? '',
    role_ar: data.role_ar ?? '',
    role: locale === 'ar' ? (data.role_ar ?? data.role_en ?? '') : (data.role_en ?? ''),
    tagline_en: data.tagline_en ?? '',
    tagline_ar: data.tagline_ar ?? '',
    tagline: locale === 'ar' ? (data.tagline_ar ?? data.tagline_en ?? '') : (data.tagline_en ?? ''),
    bio_en: data.bio_en ?? '',
    bio_ar: data.bio_ar ?? '',
    bio: locale === 'ar' ? (data.bio_ar ?? data.bio_en ?? '') : (data.bio_en ?? ''),
    avatarUrl: data.avatar_url ?? '',
    location_en: data.location_en ?? '',
    location_ar: data.location_ar ?? '',
    location: locale === 'ar' ? (data.location_ar ?? data.location_en ?? '') : (data.location_en ?? ''),
    openToWork: data.open_to_work ?? false,
    social: data.social_links ?? [],
    skills: [],
    experience: [],
    education: [],
    projects: [],
  };
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  const supabase = await createSSRSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((p) => ({
    id: p.id,
    title_en: p.title_en ?? '',
    title_ar: p.title_ar ?? '',
    title: locale === 'ar' ? (p.title_ar ?? p.title_en ?? '') : (p.title_en ?? ''),
    description_en: p.description_en ?? '',
    description_ar: p.description_ar ?? '',
    description: locale === 'ar' ? (p.description_ar ?? p.description_en ?? '') : (p.description_en ?? ''),
    highlights: [],
    techStack: p.tech_stack ?? [],
    status: 'production' as const,
    category: p.category ?? undefined,
    imageUrl: p.image_url ?? undefined,
    liveUrl: p.live_link ?? undefined,
    repoUrl: p.github_link ?? undefined,
    startedAt: p.created_at,
  }));
}

export async function getExperience(locale: Locale): Promise<WorkExperience[]> {
  const supabase = await createSSRSupabase();
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('start_date', { ascending: false });

  if (error || !data) return [];

  return data.map((e) => ({
    company_en: e.company_en ?? '',
    company_ar: e.company_ar ?? '',
    company: locale === 'ar' ? (e.company_ar ?? e.company_en ?? '') : (e.company_en ?? ''),
    position_en: e.position_en ?? '',
    position_ar: e.position_ar ?? '',
    position: locale === 'ar' ? (e.position_ar ?? e.position_en ?? '') : (e.position_en ?? ''),
    companyUrl: e.company_url ?? undefined,
    // Read from DB, fallback to 'full-time' for legacy rows
    employmentType: (e.employment_type as WorkExperience['employmentType']) ?? 'full-time',
    location: '',
    startDate: e.start_date,
    endDate: e.end_date ?? 'Present',
    description_en: e.description_en ?? '',
    description_ar: e.description_ar ?? '',
    description: locale === 'ar' ? (e.description_ar ?? e.description_en ?? '') : (e.description_en ?? ''),
    responsibilities: e.description_en ? [e.description_en] : [],
    techStack: [],
  }));
}

export async function getSkills(locale: Locale): Promise<Skill[]> {
  const supabase = await createSSRSupabase();
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category_en', { ascending: true })
    .order('name_en',     { ascending: true });

  if (error || !data) return [];

  return data.map((s) => ({
    name_en:     s.name_en ?? '',
    name_ar:     s.name_ar ?? '',
    name:        locale === 'ar' ? (s.name_ar ?? s.name_en ?? '') : (s.name_en ?? ''),
    level:       s.proficiency_level as Skill['level'],
    category_en: s.category_en ?? '',
    category_ar: s.category_ar ?? '',
    category:    locale === 'ar' ? (s.category_ar ?? s.category_en ?? '') : (s.category_en ?? ''),
  }));
}

/**
 * Returns ordered category names from the central categories table for a given section.
 * Used by public pages to render categories in the admin-defined order.
 */
export async function getSectionCategories(
  locale: Locale,
  section: 'skill' | 'project' | 'experience',
): Promise<string[]> {
  const supabase = await createSSRSupabase();
  const { data } = await supabase
    .from('categories')
    .select('name_en, name_ar')
    .eq('section', section)
    .order('name_en', { ascending: true });

  if (!data) return [];
  return data.map((c) => (locale === 'ar' ? (c.name_ar || c.name_en) : c.name_en) as string);
}
