-- Migration: 02_bilingual_columns
-- Strategy: Column-based localization — suffix _en / _ar on all user-facing text fields.

-- ─── PROFILES ────────────────────────────────────────────────────────────────
ALTER TABLE profiles RENAME COLUMN full_name TO full_name_en;
ALTER TABLE profiles ADD COLUMN full_name_ar  TEXT;
ALTER TABLE profiles RENAME COLUMN bio        TO bio_en;
ALTER TABLE profiles ADD COLUMN bio_ar        TEXT;
ALTER TABLE profiles RENAME COLUMN role       TO role_en;
ALTER TABLE profiles ADD COLUMN role_ar       TEXT;
ALTER TABLE profiles ADD COLUMN tagline_en    TEXT;
ALTER TABLE profiles ADD COLUMN tagline_ar    TEXT;
ALTER TABLE profiles ADD COLUMN location_en   TEXT;
ALTER TABLE profiles ADD COLUMN location_ar   TEXT;

-- ─── PROJECTS ────────────────────────────────────────────────────────────────
ALTER TABLE projects RENAME COLUMN title       TO title_en;
ALTER TABLE projects ADD COLUMN title_ar       TEXT;
ALTER TABLE projects RENAME COLUMN description TO description_en;
ALTER TABLE projects ADD COLUMN description_ar TEXT;

-- ─── EXPERIENCE ──────────────────────────────────────────────────────────────
ALTER TABLE experience RENAME COLUMN company     TO company_en;
ALTER TABLE experience ADD COLUMN company_ar     TEXT;
ALTER TABLE experience RENAME COLUMN position    TO position_en;
ALTER TABLE experience ADD COLUMN position_ar    TEXT;
ALTER TABLE experience RENAME COLUMN description TO description_en;
ALTER TABLE experience ADD COLUMN description_ar TEXT;

-- ─── SKILLS ──────────────────────────────────────────────────────────────────
ALTER TABLE skills RENAME COLUMN name     TO name_en;
ALTER TABLE skills ADD COLUMN name_ar     TEXT;
ALTER TABLE skills RENAME COLUMN category TO category_en;
ALTER TABLE skills ADD COLUMN category_ar TEXT;

-- RLS policies are unaffected — column renames preserve all existing policies.
