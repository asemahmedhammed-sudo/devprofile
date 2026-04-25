import { createSSRSupabase } from '@/lib/supabase';
import SkillsTable from '@/components/dashboard/SkillsTable';

export const dynamic = 'force-dynamic';

export default async function SkillsDashboardPage() {
  const supabase = await createSSRSupabase();

  const [{ data: skills }, { data: catRows }] = await Promise.all([
    supabase
      .from('skills')
      .select('id, name_en, name_ar, category_en, category_ar, proficiency_level')
      .order('category_en', { ascending: true })
      .order('name_en',     { ascending: true }),
    // Categories come from the central categories table, filtered to 'skill'
    supabase
      .from('categories')
      .select('name_en, name_ar')
      .eq('section', 'skill')
      .order('name_en', { ascending: true }),
  ]);

  const categories = (catRows ?? []).map((r) => ({
    category_en: r.name_en as string,
    category_ar: r.name_ar as string,
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-light tracking-wide text-white mb-1">Skills</h2>
        <p className="text-gray-400 text-sm font-light">
          {(skills ?? []).length} skill{(skills ?? []).length !== 1 ? 's' : ''} · {categories.length} categories
        </p>
      </header>

      <SkillsTable skills={skills ?? []} categories={categories} />
    </div>
  );
}
