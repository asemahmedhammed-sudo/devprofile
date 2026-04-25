import { createSSRSupabase } from '@/lib/supabase';
import { getProjects } from '@/services/database.service';
import ProjectsTable from '@/components/dashboard/ProjectsTable';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const supabase = await createSSRSupabase();
  const [projects, { data: catRows }] = await Promise.all([
    getProjects('en'),
    // Categories come from the central categories table, filtered to 'project'
    supabase
      .from('categories')
      .select('name_en')
      .eq('section', 'project')
      .order('name_en', { ascending: true }),
  ]);

  const categories = (catRows ?? []).map((r) => r.name_en as string);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light tracking-wide text-white">Projects</h2>
          <p className="text-gray-400 text-sm mt-1 font-light">
            {projects.length} total · {categories.length} categories
          </p>
        </div>
      </header>

      <ProjectsTable projects={projects} categories={categories} />
    </div>
  );
}
