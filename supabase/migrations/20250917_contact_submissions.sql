-- Contact form submissions (created via portfolio contact form)
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  locale text default 'ar',
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

comment on table public.contact_submissions is 'Portfolio contact form messages';
