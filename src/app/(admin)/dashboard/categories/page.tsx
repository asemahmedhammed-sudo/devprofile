import { createSSRSupabase } from '@/lib/supabase';
import CategoriesTable from '@/components/dashboard/CategoriesTable';
import type { Section } from '@/lib/validations/category';

export const dynamic = 'force-dynamic';

export default async function CategoriesDashboardPage() {
  const supabase = await createSSRSupabase();

  const { data } = await supabase
    .from('categories')
    .select('id, name_en, name_ar, section')
    .order('section', { ascending: true })
    .order('name_en', { ascending: true });

  const categories = (data ?? []) as Array<{
    id: string;
    name_en: string;
    name_ar: string;
    section: Section;
  }>;

  const counts = {
    skill:      categories.filter((c) => c.section === 'skill').length,
    project:    categories.filter((c) => c.section === 'project').length,
    experience: categories.filter((c) => c.section === 'experience').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-light tracking-wide text-white mb-1">Categories</h2>
        <p className="text-gray-400 text-sm font-light">
          {categories.length} total ·{' '}
          <span className="text-blue-400">⚡ {counts.skill} skills</span>
          {' · '}
          <span className="text-violet-400">🚀 {counts.project} projects</span>
          {' · '}
          <span className="text-amber-400">💼 {counts.experience} experience</span>
        </p>
      </header>

      <CategoriesTable categories={categories} />
    </div>
  );
}
