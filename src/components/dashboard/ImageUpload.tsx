'use client';

import { useCallback, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageUploadProps {
  /** Current public URL (controlled) */
  value?: string;
  /** Called with the new public URL after a successful upload, or '' after removal */
  onChange: (url: string) => void;
  /** Storage bucket name — defaults to "media" */
  bucket?: string;
  /** Path prefix inside the bucket — defaults to "projects" */
  folder?: string;
  /** Max file size in bytes — defaults to 5 MB */
  maxBytes?: number;
}

type UploadState = 'idle' | 'uploading' | 'error';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_DEFAULT = 5 * 1024 * 1024; // 5 MB

// ─── Helpers ──────────────────────────────────────────────────────────────────

function humanBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

/** Extract the storage path from a public URL so we can delete old files */
function pathFromUrl(url: string, bucket: string): string | null {
  try {
    const u = new URL(url);
    // e.g. /storage/v1/object/public/media/projects/abc.jpg
    const marker = `/object/public/${bucket}/`;
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(u.pathname.slice(idx + marker.length));
  } catch {
    return null;
  }
}

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-{2,}/g, '-');
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function UploadCloud({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ImageUpload({
  value,
  onChange,
  bucket = 'media',
  folder = 'projects',
  maxBytes = MAX_DEFAULT,
}: ImageUploadProps) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // ── Upload logic ────────────────────────────────────────────────────────────

  const uploadFile = useCallback(
    async (file: File) => {
      setErrorMsg('');

      // Client-side validation
      if (!ACCEPTED.includes(file.type)) {
        setErrorMsg('Unsupported format. Use JPEG, PNG, WebP, GIF, or AVIF.');
        return;
      }
      if (file.size > maxBytes) {
        setErrorMsg(`File too large. Max size is ${humanBytes(maxBytes)}.`);
        return;
      }

      setState('uploading');
      setProgress(0);

      // Delete old file from storage if there is one
      if (value) {
        const oldPath = pathFromUrl(value, bucket);
        if (oldPath) {
          await supabase.storage.from(bucket).remove([oldPath]);
        }
      }

      // Build a unique, sanitized path
      const ext = file.name.split('.').pop() ?? 'jpg';
      const base = sanitizeFilename(file.name.replace(`.${ext}`, ''));
      const path = `${folder}/${Date.now()}-${base}.${ext}`;

      // Simulate progress while uploading (XHR would give real progress,
      // but Supabase JS SDK uses fetch — we animate to 90% then jump to 100%)
      const tick = setInterval(() => {
        setProgress((p) => (p < 88 ? p + 12 : p));
      }, 180);

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false, cacheControl: '3600' });

      clearInterval(tick);

      if (error) {
        setState('error');
        setErrorMsg(error.message);
        setProgress(0);
        return;
      }

      setProgress(100);

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);

      // Brief "done" pause then reset
      setTimeout(() => {
        setState('idle');
        setProgress(0);
      }, 800);
    },
    [bucket, folder, maxBytes, onChange, supabase.storage, value],
  );

  // ── Remove ──────────────────────────────────────────────────────────────────

  async function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (!value) return;
    const path = pathFromUrl(value, bucket);
    if (path) await supabase.storage.from(bucket).remove([path]);
    onChange('');
  }

  // ── Drag handlers ───────────────────────────────────────────────────────────

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }
  function onDragLeave() {
    setIsDragging(false);
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so the same file can be re-selected after removal
    e.target.value = '';
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const isUploading = state === 'uploading';

  return (
    <div className="space-y-2">
      {/* ── Preview ── */}
      {value && !isUploading && (
        <div className="group relative w-full rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Project thumbnail"
            className="w-full aspect-video object-cover"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            {/* Replace button */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Replace
            </button>

            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove image"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Success tick */}
          {state === 'idle' && progress === 0 && value && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
              <CheckIcon className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      )}

      {/* ── Drop zone (hidden while a preview is shown, shown while uploading) ── */}
      {(!value || isUploading) && (
        <button
          type="button"
          onClick={() => !isUploading && inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={[
            'w-full flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed',
            'transition-all duration-200 cursor-pointer focus-visible:outline-none',
            isDragging
              ? 'border-white/40 bg-white/[0.06] scale-[1.01]'
              : 'border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]',
            isUploading ? 'pointer-events-none' : '',
          ].join(' ')}
        >
          {isUploading ? (
            /* Progress state */
            <div className="w-full max-w-xs px-4 flex flex-col items-center gap-3">
              <p className="text-xs text-gray-400 font-medium">Uploading…</p>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-600 font-mono">{progress}%</p>
            </div>
          ) : (
            /* Idle/drop state */
            <>
              <UploadCloud className="w-8 h-8 text-gray-600" />
              <div className="text-center">
                <p className="text-sm text-gray-400 font-medium">
                  Drop image here or{' '}
                  <span className="text-white underline underline-offset-2">browse</span>
                </p>
                <p className="text-[10px] text-gray-600 mt-1">
                  JPEG, PNG, WebP, GIF · max {humanBytes(maxBytes)}
                </p>
              </div>
            </>
          )}
        </button>
      )}

      {/* ── Error ── */}
      {state === 'error' && errorMsg && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <span>⚠</span> {errorMsg}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="sr-only"
        onChange={onInputChange}
        tabIndex={-1}
      />
    </div>
  );
}
