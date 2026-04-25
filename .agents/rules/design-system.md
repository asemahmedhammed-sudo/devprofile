---
trigger: glob
globs: src/components/**/*.tsx, src/app/**/*.tsx
---

---
description: This rule enforces the "Quiet Luxury" design system, Tailwind usage, and Framer Motion guidelines.
globs: ["src/components/**/*.tsx", "src/app/**/*.tsx"]
---
# Design System: Quiet Luxury

You are an expert UI/UX Developer. For every UI component generated or modified, you MUST strictly adhere to the following design system.

## 1. Aesthetic Core (The Vibe)
- **Concept:** "Quiet Luxury" (الفخامة الهادئة). The design must feel premium, mature, and highly professional.
- **Rule of Thumb:** Make it look expensive by what you OMIT, not what you add. Avoid visual clutter.

## 2. Color Palette & Theming
- **Background:** Deep, rich dark mode ONLY. Use colors like `#08080C` or `zinc-950`.
- **Text:** High-contrast for readability. Use `zinc-100` or `white` for headings, and muted `zinc-400` or `zinc-500` for paragraphs and secondary text.
- **Accents:** Monochromatic or very subtle metallic tones. 
- **CRITICAL:** NO bright neon colors. NO cyberpunk aesthetics. NO default blue buttons.

## 3. Styling Engine (Tailwind CSS)
- STRICTLY use Tailwind CSS classes for all styling.
- DO NOT use standard Material UI, Bootstrap, or any bloated external component libraries.
- **Glassmorphism:** For cards, navbars, or overlays, use elegant glass effects: `bg-white/5 backdrop-blur-md border border-white/10`. Keep it subtle.
- **Shadows:** Use soft, elegant shadows (`shadow-lg shadow-black/50`), avoid harsh or colorful glows.

## 4. Spacing & Typography
- **Typography:** Clean, modern sans-serif. Keep line heights generous (`leading-relaxed`).
- **Whitespace:** Err on the side of too much whitespace. Let the content breathe. Use generous padding/margins (e.g., `py-16`, `gap-8`).
- **Responsiveness:** Mobile-first approach is mandatory. Ensure graceful scaling on desktop screens.

## 5. Animations (Framer Motion)
- Animations must be sophisticated and non-intrusive.
- Use `framer-motion` for smooth micro-interactions (e.g., gentle fade-ins, subtle 1.02x scale on hover).
- **CRITICAL:** NO bouncy, chaotic, or overly flashy animations. Keep transitions smooth (e.g., `ease: "easeOut"`, `duration: 0.4`).