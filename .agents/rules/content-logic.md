---
trigger: glob
globs: src/components/**/*.tsx,src/data/**/*.ts
---

---
description: Rules for handling personal info, projects data, and props.
globs: ["src/components/**/*.tsx", "src/data/**/*.ts"]
---
# Data Integrity & Modularity

- **No Hardcoding:** Never write personal details (Name, Bio, Projects) inside UI components.
- **Source of Truth:** All content must reside in `@/data/content.ts` or as props.
- **Type Safety:** Every UI component must have a corresponding TypeScript `interface`.

# Execution:
1. Create the UI Component (Dumb Component).
2. Fetch/Import data from the central constant file.
3. Pass data via props.