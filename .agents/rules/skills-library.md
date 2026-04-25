---
trigger: glob
globs: src/**/*.tsx
---

---
description: This file contains executable AI SKILLS. Trigger these skills when requested by the user.
globs: ["src/**/*.tsx"]
---
# AI Skills Library (Executable Functions)

When the user asks you to execute a specific [SKILL], strictly follow the steps defined below without deviation.

## Skill: [build_dumb_component]
**Purpose:** Generate a clean UI component without business logic or hardcoded data.
**Execution Steps:**
1. Identify the purpose of the component.
2. Create a TypeScript `interface` for its `Props`.
3. Build the functional component receiving those props.
4. Apply the "Quiet Luxury" design system (Tailwind).
5. DO NOT add `use client` unless requested. DO NOT add animations yet.

## Skill: [apply_framer_motion]
**Purpose:** Add sophisticated, non-intrusive animations to an existing component.
**Execution Steps:**
1. Add `'use client';` at the absolute top of the file.
2. Import `{ motion }` from `framer-motion`.
3. Convert the main wrapper `div` to `motion.div`.
4. Add a subtle entry animation (e.g., `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}`).
5. Ensure the animation fits the "Quiet Luxury" vibe (no bouncing, no fast spinning).

## Skill: [wire_mock_data]
**Purpose:** Create structured dummy data for testing the component.
**Execution Steps:**
1. Look at the component's `Props` interface.
2. Create a logically structured constant (Array or Object) containing high-quality dummy data.
3. If it's for the Portfolio, ensure the data sounds professional (e.g., Senior Engineer level).
4. Inject this data into the component for preview purposes.