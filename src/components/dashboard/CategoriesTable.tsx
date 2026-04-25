'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, SECTIONS, type CategoryFormValues, type Section } from '@/lib/validations/category';
import { upsertCategory, deleteCategory } from '@/actions/categories';
import { useRouter } from 'next/navigation';

// ─── Style tokens ─────────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 ' +
  'text-white placeholder-gray-600 text-sm ' +
  'focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all duration-200';

// ─── Section metadata ──────────────────────────────────────────────────────────

const SECTION_META: Record<Section, { label: string; color: string; icon: string }> = {
  skill:      { label: 'Skill',      color: 'bg-blue-500/15 text-blue-400 border-blue-500/20',     icon: '⚡' },
  project:    { label: 'Project',    color: 'bg-violet-500/15 text-violet-400 border-violet-500/20', icon: '🚀' },
  experience: { label: 'Experience', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20',  icon: '💼' },
};

// ─── Shared primitives ────────────────────────────────────────────────────────

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

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({
  name,
  onConfirm,
  onCancel,
  loading,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm p-6 rounded-2xl bg-[#0c0c10] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-medium text-white mb-2">Delete Category</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          Permanently delete <span className="text-white font-medium">{name}</span>?
          <br />
          <span className="text-xs text-amber-400/80 mt-1 block">
            ⚠ Existing skills/projects/experience using this category are not affected.
          </span>
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

function CategoryForm({
  initial,
  onClose,
  onSaved,
}: {
  initial?: CategoryFormValues;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<ToastState>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    mode: 'onBlur',
    defaultValues: initial ?? {
      name_en: '',
      name_ar: '',
      section: 'skill',
    },
  });

  const selectedSection = watch('section');

  function onSubmit(data: CategoryFormValues) {
    startTransition(async () => {
      const result = await upsertCategory(data);
      if (result.success) {
        setToast({ type: 'success', message: initial?.id ? 'Category updated.' : 'Category added.' });
        setTimeout(() => { onSaved(); onClose(); }, 900);
      } else {
        setToast({ type: 'error', message: result.error });
      }
    });
  }

  const meta = selectedSection ? SECTION_META[selectedSection] : null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-[#0c0c10] border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
          <h3 className="text-lg font-light text-white tracking-wide">
            {initial?.id ? 'Edit Category' : 'New Category'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-6" noValidate>

          {/* Section selector */}
          <div>
            <Label>Section *</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {SECTIONS.map((s) => {
                const m = SECTION_META[s];
                const isActive = selectedSection === s;
                return (
                  <label
                    key={s}
                    className={[
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                      isActive
                        ? 'border-white/30 bg-white/[0.08] text-white'
                        : 'border-white/10 bg-white/[0.02] text-gray-500 hover:border-white/20 hover:text-gray-300',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      value={s}
                      className="sr-only"
                      {...register('section')}
                    />
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-[11px] font-medium capitalize">{m.label}</span>
                  </label>
                );
              })}
            </div>
            <FieldError msg={errors.section?.message} />
          </div>

          {/* Preview badge */}
          {meta && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Preview:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${meta.color}`}>
                {meta.icon} {selectedSection}
              </span>
            </div>
          )}

          {/* Bilingual names */}
          <div className="space-y-4">
            {/* EN */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3" dir="ltr">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">🇺🇸 English</p>
              <div>
                <Label>Name (EN) *</Label>
                <input className={inputCls} placeholder="e.g. Frontend" {...register('name_en')} />
                <FieldError msg={errors.name_en?.message} />
              </div>
            </div>

            {/* AR */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3" dir="rtl">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">🇸🇦 العربية</p>
              <div>
                <Label>الاسم (AR) *</Label>
                <input className={inputCls} placeholder="مثال: الواجهة الأمامية" {...register('name_ar')} />
                <FieldError msg={errors.name_ar?.message} />
              </div>
            </div>
          </div>

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
            {isPending ? 'Saving…' : initial?.id ? 'Update' : 'Add Category'}
          </button>
        </div>
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}

// ─── Category Row type ────────────────────────────────────────────────────────

interface CatRow {
  id: string;
  name_en: string;
  name_ar: string;
  section: Section;
}

// ─── Main Table ───────────────────────────────────────────────────────────────

export default function CategoriesTable({ categories }: { categories: CatRow[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<CategoryFormValues | undefined>(undefined);
  const [deleting, setDeleting] = useState<CatRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [filter, setFilter] = useState<Section | 'all'>('all');

  function openNew()            { setEditing(undefined); setShowForm(true); }
  function openEdit(r: CatRow)  {
    setEditing({ id: r.id, name_en: r.name_en, name_ar: r.name_ar, section: r.section });
    setShowForm(true);
  }
  function closeForm()          { setShowForm(false); setEditing(undefined); }
  function refresh()            { router.refresh(); }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    const result = await deleteCategory(deleting.id);
    setDeleteLoading(false);
    setDeleting(null);
    if (result.success) {
      setToast({ type: 'success', message: 'Category deleted.' });
      router.refresh();
    } else {
      setToast({ type: 'error', message: result.error });
    }
  }

  // Group for display
  const visible = filter === 'all' ? categories : categories.filter((c) => c.section === filter);

  // Count per section
  const counts = {
    skill:      categories.filter((c) => c.section === 'skill').length,
    project:    categories.filter((c) => c.section === 'project').length,
    experience: categories.filter((c) => c.section === 'experience').length,
  };

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">

        {/* Section filter tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10">
          {(['all', ...SECTIONS] as const).map((s) => {
            const isAll = s === 'all';
            const isActive = filter === s;
            const meta = isAll ? null : SECTION_META[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-white text-black shadow'
                    : 'text-gray-400 hover:text-white',
                ].join(' ')}
              >
                {meta && <span>{meta.icon}</span>}
                <span className="capitalize">{isAll ? 'All' : s}</span>
                <span className={[
                  'text-[10px] px-1.5 py-0.5 rounded-full',
                  isActive ? 'bg-black/20 text-white' : 'bg-white/10 text-gray-500',
                ].join(' ')}>
                  {isAll
                    ? categories.length
                    : counts[s as Section]}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          + Add Category
        </button>
      </div>

      {/* ── Empty state ── */}
      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/10 text-gray-600">
          <span className="text-4xl mb-3">🏷</span>
          <p className="text-sm">No categories yet.</p>
          <button onClick={openNew} className="mt-3 text-white text-sm underline underline-offset-4">
            Add one →
          </button>
        </div>
      )}

      {/* ── Table ── */}
      {visible.length > 0 && (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Name (EN)</th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Name (AR)</th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Section</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => {
                const meta = SECTION_META[row.section];
                return (
                  <tr
                    key={row.id}
                    className={[
                      'border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors',
                      i === visible.length - 1 ? 'border-b-0' : '',
                    ].join(' ')}
                  >
                    <td className="px-5 py-4 text-white font-medium">{row.name_en}</td>
                    <td className="px-5 py-4 text-gray-400" dir="rtl">{row.name_ar || <span className="text-gray-700">—</span>}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${meta.color}`}>
                        <span>{meta.icon}</span>
                        <span className="capitalize">{row.section}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="px-3 py-1.5 text-xs text-gray-400 border border-white/10 rounded-lg hover:text-white hover:border-white/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleting(row)}
                          className="px-3 py-1.5 text-xs text-red-500/70 border border-red-500/20 rounded-lg hover:text-red-400 hover:border-red-500/40 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-over */}
      {showForm && (
        <CategoryForm
          initial={editing}
          onClose={closeForm}
          onSaved={refresh}
        />
      )}

      {/* Delete confirm */}
      {deleting && (
        <DeleteModal
          name={deleting.name_en}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
          loading={deleteLoading}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
