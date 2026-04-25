-- Migration 05: Add image_url column to projects table
-- Stores a public URL pointing to the project's cover/thumbnail image
-- (uploaded to Supabase Storage bucket "media" under the "projects/" prefix).

ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;
