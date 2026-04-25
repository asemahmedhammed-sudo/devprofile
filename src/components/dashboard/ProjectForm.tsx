'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project';
import { upsertProject } from '@/actions/projects';
import ImageUpload from '@/components/dashboard/ImageUpload';
import type { Project } from '@/types';

// ─── Toast ────────────────────────────────────────────────────────────────────

type ToastState = { type: 'success' | 'error'; message: string } | null;

function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  return (
    <div
      className={[
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl',
        'border backdrop-blur-lg text-sm font-medium animate-in slide-in-from-bottom-4 duration-300',
        isSuccess
          ? 'bg-white/10 border-white/15 text-green-300'
          : 'bg-white/10 border-white/15 text-red-400',
      ].join(' ')}
    >
      <span>{isSuccess ? '✓' : '✕'}</span>
      <span>{toast.message}</span>
      <button onClick={onDismiss} className="ms-2 opacity-60 hover:opacity-100 transition-opacity">✕</button>
    </div>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
      {children}
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-400 mt-1">{message}</p>;
}

const inputCls =
  'w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 ' +
  'text-white placeholder-gray-600 text-sm ' +
  'focus:outline-none focus:border-white/25 focus:bg-white/[0.06] ' +
  'transition-all duration-200';

const textareaCls = inputCls + ' resize-none';

// ─── (ImageUpload is now a standalone component at @/components/dashboard/ImageUpload) ─

// ─── Main Form ────────────────────────────────────────────────────────────────

interface ProjectFormProps {
  project?: Project;
  categories?: string[];
  onSuccess?: () => void;
}

export default function ProjectForm({ project, categories = [], onSuccess }: ProjectFormProps) {
  const [toast, setToast] = useState<ToastState>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: 'onBlur',
    defaultValues: project
      ? {
          id:             project.id,
          title_en:       project.title_en,
          title_ar:       project.title_ar,
          description_en: project.description_en,
          description_ar: project.description_ar,
          tech_stack:     project.techStack.join(', '),
          category:       project.category ?? '',
          live_link:      project.liveUrl ?? '',
          github_link:    project.repoUrl ?? '',
          image_url:      project.imageUrl ?? '',
        }
      : {
          title_en:       '',
          title_ar:       '',
          description_en: '',
          description_ar: '',
          tech_stack:     '',
          category:       '',
          live_link:      '',
          github_link:    '',
          image_url:      '',
        },
  });

  const imageUrl = watch('image_url');

  function onSubmit(data: ProjectFormValues) {
    startTransition(async () => {
      const result = await upsertProject(data);
      if (result.success) {
        setToast({ type: 'success', message: project ? 'Project updated.' : 'Project created.' });
        onSuccess?.();
      } else {
        setToast({ type: 'error', message: result.error ?? 'Unknown error' });
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

        {/* ── Split bilingual panel — both columns always visible ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* English — LTR */}
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="ltr">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              🇺🇸 English Content
            </p>

            <div>
              <Label>Title (EN)</Label>
              <input
                className={inputCls}
                placeholder="e.g. Smart Sight"
                {...register('title_en')}
              />
              <FieldError message={errors.title_en?.message} />
            </div>

            <div>
              <Label>Description (EN)</Label>
              <textarea
                rows={5}
                className={textareaCls}
                placeholder="Describe the project in English…"
                {...register('description_en')}
              />
              <FieldError message={errors.description_en?.message} />
            </div>
          </div>

          {/* Arabic — RTL */}
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="rtl">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              🇸🇦 المحتوى العربي
            </p>

            <div>
              <Label>العنوان (AR)</Label>
              <input
                className={inputCls}
                placeholder="مثال: سمارت سايت"
                {...register('title_ar')}
              />
              <FieldError message={errors.title_ar?.message} />
            </div>

            <div>
              <Label>الوصف (AR)</Label>
              <textarea
                rows={5}
                className={textareaCls}
                placeholder="اوصف المشروع بالعربية…"
                {...register('description_ar')}
              />
              <FieldError message={errors.description_ar?.message} />
            </div>
          </div>
        </div>

        {/* ── Shared Fields ── */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="ltr">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
            Shared Details
          </p>

          <div>
            <Label>Category</Label>
            <input
              className={inputCls}
              placeholder="e.g. Web App, Mobile, Open Source"
              list="project-category-list"
              {...register('category')}
            />
            <datalist id="project-category-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <Label>Tech Stack (comma-separated)</Label>
            <input
              className={inputCls}
              placeholder="Next.js, TypeScript, Supabase"
              {...register('tech_stack')}
            />
            <FieldError message={errors.tech_stack?.message} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Live URL</Label>
              <input
                type="url"
                className={inputCls}
                placeholder="https://example.com"
                {...register('live_link')}
              />
              <FieldError message={errors.live_link?.message} />
            </div>
            <div>
              <Label>GitHub URL</Label>
              <input
                type="url"
                className={inputCls}
                placeholder="https://github.com/…"
                {...register('github_link')}
              />
              <FieldError message={errors.github_link?.message} />
            </div>
          </div>

          <div>
            <Label>Thumbnail</Label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setValue('image_url', url, { shouldValidate: true })}
            />
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-white text-black font-medium text-sm rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving…' : project ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}


