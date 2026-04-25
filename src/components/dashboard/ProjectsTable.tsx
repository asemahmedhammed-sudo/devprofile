'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectForm from './ProjectForm';
import { deleteProject } from '@/actions/projects';
import type { Project } from '@/types';

interface Props {
  projects: Project[];
  categories: string[];
}

// ─── Slide-over Panel ─────────────────────────────────────────────────────────

function SlideOver({
  open,
  onClose,
  project,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  project?: Project;
  categories: string[];
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0d0d12] border-l border-white/10 overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-light tracking-wide text-white">
                {project ? 'Edit Project' : 'New Project'}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ProjectForm
                project={project}
                categories={categories}
                onSuccess={onClose}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

export default function ProjectsTable({ projects: initial, categories }: Props) {
  const [projects, setProjects] = useState(initial);
  const [slideOver, setSlideOver] = useState<{ open: boolean; project?: Project }>({
    open: false,
  });
  const [deleting, setDeleting] = useState<string | null>(null);

  function openNew() {
    setSlideOver({ open: true, project: undefined });
  }

  function openEdit(project: Project) {
    setSlideOver({ open: true, project });
  }

  function closePanel() {
    setSlideOver({ open: false });
    // Optimistic refresh — actual data revalidated by server action
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project? This is permanent.')) return;
    setDeleting(id);
    const result = await deleteProject(id);
    if (result.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleting(null);
  }

  return (
    <>
      {/* ── Action Bar ── */}
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          <span className="text-base leading-none">+</span>
          Add Project
        </button>
      </div>

      {/* ── Table ── */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-500 text-sm">No projects yet.</p>
          <button onClick={openNew} className="mt-4 text-white text-sm underline underline-offset-4">
            Add your first project →
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                  Project
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-widest text-gray-500 font-medium hidden sm:table-cell">
                  Category
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-widest text-gray-500 font-medium hidden md:table-cell">
                  Stack
                </th>
                <th className="px-5 py-3.5 text-right text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  {/* Title + bilingual indicator */}
                  <td className="px-5 py-4">
                    <p className="text-white font-medium truncate max-w-xs">{project.title_en}</p>
                    <p className="text-gray-500 text-xs mt-0.5 truncate max-w-xs" dir="rtl">
                      {project.title_ar || (
                        <span className="italic opacity-50">No Arabic</span>
                      )}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4 hidden sm:table-cell">
                    {project.category ? (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-white/10 text-gray-400">
                        {project.category}
                      </span>
                    ) : (
                      <span className="text-gray-700 text-xs">—</span>
                    )}
                  </td>

                  {/* Tech stack */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-white/[0.06] border border-white/10 rounded text-[10px] text-gray-300 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-[10px] text-gray-500 self-center">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(project)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deleting === project.id}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20 disabled:opacity-40"
                      >
                        {deleting === project.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SlideOver
        open={slideOver.open}
        onClose={closePanel}
        project={slideOver.project}
        categories={categories}
      />
    </>
  );
}
