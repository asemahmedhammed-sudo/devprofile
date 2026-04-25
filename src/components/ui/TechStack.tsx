'use client';

import { motion, type Variants } from "framer-motion";
import type { Skill, SkillLevel } from "@/types";

interface TechStackProps {
  skills: Skill[];
  /** Category names in admin-defined order (from categories table, section='skill') */
  categoryOrder?: string[];
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const LEVEL_DOTS: Record<SkillLevel, number> = {
  expert:    3,
  proficient: 2,
  familiar:  1,
};

/**
 * Groups skills by category, then orders the groups by categoryOrder array.
 * Any skills whose category isn't in categoryOrder are appended at the end.
 */
function groupAndOrder(
  skills: Skill[],
  categoryOrder: string[],
): Array<{ category: string; items: Skill[] }> {
  // Build a map: category name → skills
  const map = new Map<string, Skill[]>();
  for (const skill of skills) {
    const key = skill.category || 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(skill);
  }

  // Ordered categories first
  const result: Array<{ category: string; items: Skill[] }> = [];
  const seen = new Set<string>();

  for (const cat of categoryOrder) {
    if (map.has(cat)) {
      result.push({ category: cat, items: map.get(cat)! });
      seen.add(cat);
    }
  }

  // Leftover categories not in the canonical list
  for (const [cat, items] of Array.from(map.entries())) {
    if (!seen.has(cat)) {
      result.push({ category: cat, items });
    }
  }

  return result;
}

function SkillPill({ skill }: { skill: Skill }) {
  const dots = LEVEL_DOTS[skill.level] ?? 2;

  return (
    <motion.li
      variants={pillVariants}
      className={[
        "group flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl cursor-default",
        "border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300",
        "transition-colors duration-300",
        "dark:border-white/[0.07] dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:hover:border-white/[0.12]",
      ].join(" ")}
    >
      <span className="text-sm text-zinc-700 font-light tracking-wide dark:text-zinc-300">
        {skill.name}
      </span>

      <span className="flex items-center gap-[3px]" aria-label={skill.level}>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={[
              "block w-1 h-1 rounded-full transition-opacity duration-300",
              n <= dots
                ? "bg-zinc-500 dark:bg-zinc-400"
                : "bg-zinc-200 dark:bg-zinc-700",
            ].join(" ")}
          />
        ))}
      </span>
    </motion.li>
  );
}

export default function TechStack({ skills, categoryOrder = [] }: TechStackProps) {
  const groups = groupAndOrder(skills, categoryOrder);

  return (
    <section id="skills" className="section-padding max-w-6xl mx-auto" aria-label="Tech Stack">
      <motion.div
        variants={headingVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-14"
      >
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600 mb-3">
          02 / Skills
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Tech Stack
        </h2>
      </motion.div>

      {groups.length === 0 ? (
        <p className="text-sm text-zinc-400">No skills added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {groups.map(({ category, items }) => (
            <div key={category}>
              <motion.p
                variants={headingVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="text-[11px] font-mono tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-600 mb-4"
              >
                {category}
              </motion.p>

              <motion.ul
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                className="flex flex-col gap-2"
                role="list"
              >
                {items.map((skill) => (
                  <SkillPill key={skill.name_en} skill={skill} />
                ))}
              </motion.ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
