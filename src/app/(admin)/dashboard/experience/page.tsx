import { createSSRSupabase } from '@/lib/supabase';
import ExperienceTable from '@/components/dashboard/ExperienceTable';

export const dynamic = 'force-dynamic';

export default async function ExperienceDashboardPage() {
  const supabase = await createSSRSupabase();

  const [{ data }, { data: catRows }] = await Promise.all([
    supabase
      .from('experience')
      .select('id, company_en, company_ar, position_en, position_ar, description_en, description_ar, start_date, end_date, employment_type')
      .order('start_date', { ascending: false }),
    // Employment types come from the central categories table, filtered to 'experience'
    supabase
      .from('categories')
      .select('name_en')
      .eq('section', 'experience')
      .order('name_en', { ascending: true }),
  ]);

  const employmentTypes = (catRows ?? []).map((r) => r.name_en as string);

  const experiences = data ?? [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-light tracking-wide text-white mb-1">Experience</h2>
        <p className="text-gray-400 text-sm font-light">
          {experiences.length} position{experiences.length !== 1 ? 's' : ''} · Bilingual content management
        </p>
      </header>

      <ExperienceTable experiences={experiences} employmentTypes={employmentTypes} />
    </div>
  );
}
