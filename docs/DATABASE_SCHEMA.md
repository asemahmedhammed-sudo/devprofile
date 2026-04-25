# Database Schema Design

This document outlines the proposed database schema using a PostgreSQL-compatible relational structure (suitable for Prisma or Supabase). The collections map directly to the TypeScript types defined in `src/types/index.ts`.

## Enums
```sql
CREATE TYPE skill_level AS ENUM ('expert', 'proficient', 'familiar');
CREATE TYPE project_status AS ENUM ('production', 'wip', 'archived');
CREATE TYPE employment_type AS ENUM ('full-time', 'contract', 'part-time');
CREATE TYPE social_platform AS ENUM ('github', 'linkedin', 'twitter', 'website', 'email');
```

## Tables

### `profiles`
The core identity and configuration of the profile.
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `title` (VARCHAR)
- `tagline` (TEXT)
- `bio` (TEXT)
- `avatar_url` (VARCHAR)
- `location` (VARCHAR)
- `open_to_work` (BOOLEAN)
- `created_at` (TIMESTAMP DEFAULT NOW())
- `updated_at` (TIMESTAMP DEFAULT NOW())

### `social_links`
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key -> profiles.id)
- `platform` (social_platform)
- `url` (VARCHAR)
- `label` (VARCHAR)

### `skills`
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key -> profiles.id)
- `name` (VARCHAR)
- `level` (skill_level)
- `category` (VARCHAR) -- e.g., "Frontend", "Backend"

### `projects`
- `id` (VARCHAR, Primary Key) -- A unique slug-like ID
- `profile_id` (UUID, Foreign Key -> profiles.id)
- `title` (VARCHAR)
- `description` (TEXT)
- `highlights` (TEXT[]) -- Array of strings mapping to bullet points
- `tech_stack` (TEXT[]) -- Array of tech tags
- `status` (project_status)
- `live_url` (VARCHAR, Nullable)
- `repo_url` (VARCHAR, Nullable)
- `started_at` (TIMESTAMP OR DATE)
- `created_at` (TIMESTAMP DEFAULT NOW())
- `updated_at` (TIMESTAMP DEFAULT NOW())

### `work_experiences`
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key -> profiles.id)
- `company` (VARCHAR)
- `role` (VARCHAR)
- `employment_type` (employment_type)
- `location` (VARCHAR)
- `start_date` (VARCHAR) -- e.g., "MMM YYYY"
- `end_date` (VARCHAR) -- e.g., "MMM YYYY" or "Present"
- `responsibilities` (TEXT[]) -- Array of strings
- `tech_stack` (TEXT[])

### `educations`
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key -> profiles.id)
- `institution` (VARCHAR)
- `degree` (VARCHAR)
- `field` (VARCHAR)
- `graduation_year` (INTEGER)
- `honors` (VARCHAR, Nullable)

## Relationships Overview
- **One `profile`** has **Many `social_links`**
- **One `profile`** has **Many `skills`**
- **One `profile`** has **Many `projects`**
- **One `profile`** has **Many `work_experiences`**
- **One `profile`** has **Many `educations`**

## Implementation Notes
Arrays (`TEXT[]`) are utilized for lists of simple strings (like `highlights` or `tech_stack`) instead of creating separate tables to join against, keeping data retrieval fast and perfectly aligned with the TypeScript interfaces for front-end rendering without any DTO mapping overhead.
