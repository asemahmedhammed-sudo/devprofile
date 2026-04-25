'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema, type ExperienceFormValues } from '@/lib/validations/experience';
import { upsertExperience, deleteExperience } from '@/actions/experience';
import { useRouter } from 'next/navigation';

// ─── Primitives ───────────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 ' +
  'text-white placeholder-gray-600 text-sm ' +
  'focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all duration-200';

const textareaCls = inputCls + ' resize-none';

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
  companyName,
  onConfirm,
  onCancel,
  loading,
}: {
  companyName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm p-6 rounded-2xl bg-[#0c0c10] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-medium text-white mb-2">Delete Experience</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          Permanently delete the role at <span className="text-white font-medium">{companyName}</span>?
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

function ExperienceForm({
  initial,
  employmentTypes,
  onClose,
  onSaved,
}: {
  initial?: ExperienceFormValues;
  employmentTypes: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<ToastState>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    mode: 'onBlur',
    defaultValues: initial ?? {
      company_en:      '',
      company_ar:      '',
      position_en:     '',
      position_ar:     '',
      description_en:  '',
      description_ar:  '',
      employment_type: 'Full-time',
      start_date:      '',
      end_date:        '',
      is_current:      false,
      company_url:     '',
    },
  });

  const isCurrent = watch('is_current');

  function onSubmit(data: ExperienceFormValues) {
    startTransition(async () => {
      const result = await upsertExperience(data);
      if (result.success) {
        setToast({ type: 'success', message: initial?.id ? 'Experience updated.' : 'Experience added.' });
        setTimeout(() => { onSaved(); onClose(); }, 900);
      } else {
        setToast({ type: 'error', message: result.error });
      }
    });
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl flex flex-col bg-[#0c0c10] border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
          <h3 className="text-lg font-light text-white tracking-wide">
            {initial?.id ? 'Edit Experience' : 'New Experience'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-6" noValidate>

          {/* Bilingual split — Company & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EN */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="ltr">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">🇺🇸 English</p>
              <div>
                <Label>Company (EN) *</Label>
                <input className={inputCls} placeholder="e.g. Acme Corp" {...register('company_en')} />
                <FieldError msg={errors.company_en?.message} />
              </div>
              <div>
                <Label>Company URL</Label>
                <input className={inputCls} placeholder="https://example.com" {...register('company_url')} />
                <FieldError msg={errors.company_url?.message} />
              </div>
              <div>
                <Label>Position (EN) *</Label>
                <input className={inputCls} placeholder="e.g. Lead Engineer" {...register('position_en')} />
                <FieldError msg={errors.position_en?.message} />
              </div>
              <div>
                <Label>Description (EN)</Label>
                <textarea rows={4} className={textareaCls} placeholder="What did you build or achieve?" {...register('description_en')} />
              </div>
            </div>

            {/* AR */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="rtl">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">🇸🇦 العربية</p>
              <div>
                <Label>الشركة (AR)</Label>
                <input className={inputCls} placeholder="مثال: شركة أكمي" {...register('company_ar')} />
              </div>
              <div>
                <Label>المسمى الوظيفي (AR)</Label>
                <input className={inputCls} placeholder="مثال: مهندس رئيسي" {...register('position_ar')} />
              </div>
              <div>
                <Label>الوصف (AR)</Label>
                <textarea rows={4} className={textareaCls} placeholder="ماذا بنيت أو حققت؟" {...register('description_ar')} />
              </div>
            </div>
          </div>

          {/* Timeline + Employment type */}
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4" dir="ltr">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">Timeline & Type</p>

            <div>
              <Label>Employment Type</Label>
              <input
                className={inputCls}
                placeholder="e.g. Full-time, Contract"
                list="emp-type-list"
                {...register('employment_type')}
              />
              <datalist id="emp-type-list">
                {employmentTypes.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <input type="month" className={inputCls} {...register('start_date')} />
                <FieldError msg={errors.start_date?.message} />
              </div>
              <div>
                <Label>End Date</Label>
                <input
                  type="month"
                  className={inputCls}
                  disabled={isCurrent}
                  {...register('end_date')}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-white rounded" {...register('is_current')} />
              <span className="text-sm text-gray-300">Currently working here</span>
            </label>
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
            {isPending ? 'Saving…' : initial?.id ? 'Update' : 'Add Experience'}
          </button>
        </div>
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}

// ─── Data Table ───────────────────────────────────────────────────────────────

interface ExpRow {
  id: string;
  company_en: string;
  company_ar: string;
  company_url?: string;
  position_en: string;
  position_ar: string;
  description_en: string;
  description_ar: string;
  employment_type: string | null;
  start_date: string;
  end_date: string | null;
}

function formatDate(d: string | null) {
  if (!d) return 'Present';
  const [y, m] = d.split('-');
  const month = new Date(Number(y), Number(m) - 1).toLocaleString('en', { month: 'short' });
  return `${month} ${y}`;
}

export default function ExperienceTable({
  experiences,
  employmentTypes,
}: {
  experiences: ExpRow[];
  employmentTypes: string[];
}) {
  const router = useRouter();
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<ExperienceFormValues | undefined>(undefined);
  const [deleting, setDeleting]   = useState<ExpRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast]         = useState<ToastState>(null);

  function openNew()             { setEditing(undefined); setShowForm(true); }
  function openEdit(e: ExpRow)   {
    setEditing({
      id:              e.id,
      company_en:      e.company_en,
      company_ar:      e.company_ar ?? '',
      company_url:     e.company_url ?? '',
      position_en:     e.position_en,
      position_ar:     e.position_ar ?? '',
      description_en:  e.description_en ?? '',
      description_ar:  e.description_ar ?? '',
      employment_type: e.employment_type ?? 'Full-time',
      start_date:      e.start_date.substring(0, 7),
      end_date:        e.end_date ? e.end_date.substring(0, 7) : '',
      is_current:      !e.end_date,
    });
    setShowForm(true);
  }
  function closeForm()           { setShowForm(false); setEditing(undefined); }
  function refresh()             { router.refresh(); }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    const result = await deleteExperience(deleting.id);
    setDeleteLoading(false);
    setDeleting(null);
    if (result.success) {
      setToast({ type: 'success', message: 'Experience deleted.' });
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
          + Add Experience
        </button>
      </div>

      {/* Empty state */}
      {experiences.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/10 text-gray-600">
          <span className="text-4xl mb-3">💼</span>
          <p className="text-sm">No experience yet. Add your work history.</p>
        </div>
      )}

      {/* Cards — richer than table for experience */}
      {experiences.length > 0 && (
        <div className="space-y-3">
          {experiences.map((e) => (
            <div
              key={e.id}
              className="flex items-start justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.03] transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-white font-medium text-sm truncate">{e.position_en}</p>
                  {e.employment_type && (
                    <span className="shrink-0 text-[10px] border border-white/10 text-gray-500 px-2 py-0.5 rounded-full">
                      {e.employment_type}
                    </span>
                  )}
                  {!e.end_date && (
                    <span className="shrink-0 text-[10px] border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{e.company_en}</p>
                <p className="text-gray-600 text-xs mt-1 font-mono">
                  {formatDate(e.start_date)} — {formatDate(e.end_date)}
                </p>
                {e.company_ar && (
                  <p className="text-gray-600 text-xs mt-2" dir="rtl">{e.position_ar} · {e.company_ar}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(e)}
                  className="px-3 py-1.5 text-xs text-gray-400 border border-white/10 rounded-lg hover:text-white hover:border-white/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleting(e)}
                  className="px-3 py-1.5 text-xs text-red-500/70 border border-red-500/20 rounded-lg hover:text-red-400 hover:border-red-500/40 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <ExperienceForm initial={editing} employmentTypes={employmentTypes} onClose={closeForm} onSaved={refresh} />}

      {deleting && (
        <DeleteModal
          companyName={deleting.company_en}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
          loading={deleteLoading}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
