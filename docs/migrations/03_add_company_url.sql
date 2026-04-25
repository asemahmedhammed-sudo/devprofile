-- ─── ADD COMPANY_URL TO EXPERIENCE ─────────────────────────────────────────────
ALTER TABLE experience ADD COLUMN IF NOT EXISTS company_url TEXT;
