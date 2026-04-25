'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillSchema, type SkillFormValues } from '@/lib/validations/skill';
import { upsertSkill, deleteSkill } from '@/actions/skills';
import { useRouter } from 'next/navigation';

// ─── Shared primitives ─────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 ' +
  'text-white placeholder-gray-600 text-sm ' +
  'focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all duration-200';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
      {children}
    </span>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-400 mt-1">{msg}</p> : null;
}

type ToastState = { type: 'success' | 'error'; message: string } | null;

function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div className={[
      'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl',
      'border backdrop-blur-lg text-sm font-medium animate-in slide-in-from-bottom-4 duration-300',
      ok ? 'bg-white/10 border-white/15 text-green-300' : 'bg-white/10 border-white/15 text-red-400',
    ].join(' ')}>
      <span>{ok ? '✓' : '✕'}</span>
      <span>{toast.message}</span>
      <button onClick={onDismiss} className="ms-2 opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({
  skillName,
  onConfirm,
  onCancel,
  loading,
}: {
  skillName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm p-6 rounded-2xl bg-[#0c0c10] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-medium text-white mb-2">Delete Skill</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          Permanently delete <span className="text-white font-medium">{skillName}</span>?
          This removes it from the public portfolio immediately.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg text-sm text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Slide-over Form ──────────────────────────────────────────────────────────

const LEVELS: SkillFormValues['proficiency_level'][] = ['expert', 'proficient', 'familiar'];

function SkillForm({
  initial,
  categories,
  onClose,
  onSaved,
}: {
  initial?: SkillFormValues;
  categories: Array<{ category_en: string; category_ar: string }>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<ToastState>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    mode: 'onBlur',
    defaultValues: initial ?? {
      name_en: '',
      name_ar: '',
      category_en: '',
      category_ar: '',
      proficiency_level: 'proficient',
    },
  });

  function onSubmit(data: SkillFormValues) {
    startTransition(async () => {
      const result = await upsertSkill(data);
      if (result.success) {
        setToast({ type: 'success', message: initial?.id ? 'Skill updated.' : 'Skill added.' });
        setTimeout(() => { onSaved(); onClose(); }, 900);
      } else {
        setToast({ type: 'error', message: result.error });
      }
    });
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl flex flex-col bg-[#0c0c10] border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
          <h3 className="text-lg font-light text-white tracking-wide">
            {initial?.id ? 'Edit Skill' : 'New Skill'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-6" noValidate>

          {/* Bilingual split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EN */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="ltr">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">🇺🇸 English</p>
              <div>
                <Label>Name (EN) *</Label>
                <input className={inputCls} placeholder="e.g. TypeScript" {...register('name_en')} />
                <FieldError msg={errors.name_en?.message} />
              </div>
              <div>
                <Label>Category (EN)</Label>
                {/* datalist = native combobox: shows suggestions, allows free text */}
                <input
                  className={inputCls}
                  placeholder="e.g. Frontend"
                  list="cat-en-list"
                  {...register('category_en')}
                />
                <datalist id="cat-en-list">
                  {categories.map((c) => (
                    <option key={c.category_en} value={c.category_en} />
                  ))}
                </datalist>
              </div>
            </div>
            {/* AR */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="rtl">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">🇸🇦 العربية</p>
              <div>
                <Label>الاسم (AR)</Label>
                <input className={inputCls} placeholder="مثال: تايب سكريبت" {...register('name_ar')} />
              </div>
              <div>
                <Label>الفئة (AR)</Label>
                <input
                  className={inputCls}
                  placeholder="مثال: الواجهة الأمامية"
                  list="cat-ar-list"
                  {...register('category_ar')}
                />
                <datalist id="cat-ar-list">
                  {categories.map((c) => (
                    <option key={c.category_ar} value={c.category_ar} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Level */}
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]" dir="ltr">
            <Label>Proficiency Level</Label>
            <div className="flex gap-3 mt-1">
              {LEVELS.map((lvl) => (
                <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value={lvl} {...register('proficiency_level')} className="accent-white" />
                  <span className="text-sm text-gray-300 capitalize">{lvl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hidden id for edit */}
          <input type="hidden" {...register('id')} />
        </form>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-white/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Saving…' : initial?.id ? 'Update Skill' : 'Add Skill'}
          </button>
        </div>
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}

// ─── Data Table ───────────────────────────────────────────────────────────────

const LEVEL_BADGE: Record<string, string> = {
  expert:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  proficient: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  familiar:   'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

interface SkillRow {
  id: string;
  name_en: string;
  name_ar: string;
  category_en: string;
  category_ar: string;
  proficiency_level: string;
}

export default function SkillsTable({
  skills,
  categories,
}: {
  skills: SkillRow[];
  categories: Array<{ category_en: string; category_ar: string }>;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<SkillFormValues | undefined>(undefined);
  const [deleting, setDeleting] = useState<SkillRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  function openNew()          { setEditing(undefined); setShowForm(true); }
  function openEdit(s: SkillRow) {
    setEditing({
      id: s.id,
      name_en: s.name_en,
      name_ar: s.name_ar ?? '',
      category_en: s.category_en ?? '',
      category_ar: s.category_ar ?? '',
      proficiency_level: (s.proficiency_level as SkillFormValues['proficiency_level']) ?? 'proficient',
    });
    setShowForm(true);
  }
  function closeForm()        { setShowForm(false); setEditing(undefined); }
  function refresh()          { router.refresh(); }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    const result = await deleteSkill(deleting.id);
    setDeleteLoading(false);
    setDeleting(null);
    if (result.success) {
      setToast({ type: 'success', message: 'Skill deleted.' });
      router.refresh();
    } else {
      setToast({ type: 'error', message: result.error });
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          + Add Skill
        </button>
      </div>

      {/* Empty state */}
      {skills.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/10 text-gray-600">
          <span className="text-4xl mb-3">⚡</span>
          <p className="text-sm">No skills yet. Add your first skill.</p>
        </div>
      )}

      {/* Table */}
      {skills.length > 0 && (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Name</th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Arabic</th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Category</th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Level</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {skills.map((s, i) => (
                <tr
                  key={s.id}
                  className={[
                    'border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors',
                    i === skills.length - 1 ? 'border-b-0' : '',
                  ].join(' ')}
                >
                  <td className="px-5 py-4 text-white font-medium">{s.name_en}</td>
                  <td className="px-5 py-4 text-gray-400" dir="rtl">{s.name_ar || <span className="text-gray-700">—</span>}</td>
                  <td className="px-5 py-4 text-gray-400">{s.category_en || <span className="text-gray-700">—</span>}</td>
                  <td className="px-5 py-4">
                    <span className={[
                      'inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border capitalize',
                      LEVEL_BADGE[s.proficiency_level] ?? LEVEL_BADGE.proficient,
                    ].join(' ')}>
                      {s.proficiency_level}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="px-3 py-1.5 text-xs text-gray-400 border border-white/10 rounded-lg hover:text-white hover:border-white/20 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(s)}
                        className="px-3 py-1.5 text-xs text-red-500/70 border border-red-500/20 rounded-lg hover:text-red-400 hover:border-red-500/40 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <SkillForm
          initial={editing}
          categories={categories}
          onClose={closeForm}
          onSaved={refresh}
        />
      )}

      {/* Delete confirm */}
      {deleting && (
        <DeleteModal
          skillName={deleting.name_en}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
          loading={deleteLoading}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
