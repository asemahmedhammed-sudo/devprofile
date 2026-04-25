-- Migration 04: Add category column to projects table
-- Allows projects to be categorised (e.g. Backend, Frontend, Mobile, UI/UX)
-- for the filter tab UX on the public portfolio page.

ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT;

-- Optional: create an index for fast filtering by category
CREATE INDEX IF NOT EXISTS projects_category_idx ON projects (category);
