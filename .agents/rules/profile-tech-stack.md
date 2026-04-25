---
trigger: always_on
---

---
description: Constraints for Next.js 14, Tailwind, and Design System.
globs: ["src/app/**/*.tsx", "src/components/**/*.tsx"]
---
# Tech Stack: Next.js 14 & Tailwind

- **App Router:** Use `app/` directory architecture strictly.
- **Server Components (RSC):** Default to Server Components. Use `'use client';` ONLY at the leaf level for interactivity (Framer Motion, hooks).
- **Styling:** Strictly use Tailwind CSS. Apply "Quiet Luxury" aesthetic:
  - Background: Deep Dark (`#08080C`).
  - Surface: Glassmorphism (`bg-white/5 backdrop-blur-lg border-white/10`).
  - Spacing: Ample whitespace (`tracking-wide`, `leading-relaxed`).

# The "Quiet Luxury" Rule: