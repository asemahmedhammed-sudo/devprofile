import { getProjects } from '@/services/database.service';
import ProjectsTable from '@/components/dashboard/ProjectsTable';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage({
  params,
}: {
  params: { locale: string };
}) {
  const projects = await getProjects(params.locale as 'en' | 'ar');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light tracking-wide text-white">Projects</h2>
          <p className="text-gray-400 text-sm mt-1 font-light">
            {projects.length} total · Bilingual content management
          </p>
        </div>
      </header>

      <ProjectsTable projects={projects} categories={[]} />
    </div>
  );
}
