'use client';

import { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { Project, ProjectStatus } from "@/types";

interface ProjectsGridProps {
  projects: Project[];
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.25, ease: "easeIn" } },
};

const STATUS_CONFIG: Record<ProjectStatus, { label: string; className: string }> = {
  production: {
    label: "Live",
    className:
      "text-emerald-700 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/20 dark:bg-emerald-500/10",
  },
  wip: {
    label: "In Progress",
    className:
      "text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-500/20 dark:bg-amber-500/10",
  },
  archived: {
    label: "Archived",
    className:
      "text-zinc-500 border-zinc-200 bg-zinc-50 dark:text-zinc-500 dark:border-zinc-700 dark:bg-white/[0.02]",
  },
};

const CATEGORY_ACCENT: Record<string, { dot: string; badge: string; imageFallback: string }> = {
  backend: {
    dot: "bg-violet-500",
    badge: "text-violet-700 bg-violet-50 border-violet-200 dark:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/20",
    imageFallback: "from-violet-500/20 to-violet-900/40",
  },
  frontend: {
    dot: "bg-sky-500",
    badge: "text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20",
    imageFallback: "from-sky-500/20 to-sky-900/40",
  },
  mobile: {
    dot: "bg-rose-500",
    badge: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20",
    imageFallback: "from-rose-500/20 to-rose-900/40",
  },
  "ui/ux": {
    dot: "bg-fuchsia-500",
    badge: "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200 dark:text-fuchsia-400 dark:bg-fuchsia-500/10 dark:border-fuchsia-500/20",
    imageFallback: "from-fuchsia-500/20 to-fuchsia-900/40",
  },
  default: {
    dot: "bg-zinc-400",
    badge: "text-zinc-600 bg-zinc-50 border-zinc-200 dark:text-zinc-400 dark:bg-white/[0.04] dark:border-white/[0.08]",
    imageFallback: "from-zinc-500/20 to-zinc-900/40",
  },
};

function getCategoryAccent(category?: string) {
  const key = category?.toLowerCase() ?? "default";
  return CATEGORY_ACCENT[key] ?? CATEGORY_ACCENT.default;
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2 11L11 2M11 2H5.5M11 2V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function ImagePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

// ─── Filter Tab ────────────────────────────────────────────────────────────────

interface FilterTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function FilterTab({ label, count, active, onClick }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 select-none whitespace-nowrap",
        active
          ? "text-zinc-900 dark:text-zinc-50"
          : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId="active-filter-pill"
          className="absolute inset-0 rounded-full bg-zinc-100 border border-zinc-200 dark:bg-white/[0.07] dark:border-white/[0.1]"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10">{label}</span>
      <span
        className={[
          "relative z-10 text-[10px] font-mono min-w-[1.25rem] text-center",
          active ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-600",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const accent = getCategoryAccent(project.category);
  const status = STATUS_CONFIG[project.status];
  const hasLinks = project.liveUrl || project.repoUrl;

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className={[
        "group relative flex flex-col rounded-2xl overflow-hidden h-full",
        "border border-zinc-200 bg-white",
        "hover:border-zinc-300 hover:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.14)]",
        "dark:border-white/[0.07] dark:bg-white/[0.03]",
        "dark:hover:border-white/[0.14] dark:hover:bg-white/[0.05] dark:hover:shadow-[0_24px_64px_-20px_rgba(0,0,0,0.7)]",
        "transition-all duration-500",
      ].join(" ")}
    >
      {/* ── Image / Hero area ─────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-white/[0.04] flex-shrink-0">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          /* Gradient placeholder */
          <div
            className={`w-full h-full bg-gradient-to-br ${accent.imageFallback} flex items-center justify-center`}
          >
            <ImagePlaceholderIcon className="w-10 h-10 text-white/20" />
          </div>
        )}

        {/* Overlay gradient — bleeds into the card body */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-[#0a0a10] to-transparent" />

        {/* Floating link buttons — top-right of image */}
        {hasLinks && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open live site"
                className="flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-zinc-100 shadow-lg border border-zinc-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150"
              >
                Live <ExternalLinkIcon />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-700 dark:text-zinc-200 shadow-lg border border-zinc-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150"
              >
                <GitHubIcon />
              </a>
            )}
          </div>
        )}
      </div>

      {/* ── Card body ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Row: category + status */}
        <div className="flex items-center justify-between gap-3">
          {project.category ? (
            <span
              className={[
                "inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border",
                accent.badge,
              ].join(" ")}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${accent.dot}`} />
              {project.category}
            </span>
          ) : (
            <span />
          )}

          <span
            className={[
              "text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border flex-shrink-0",
              status.className,
            ].join(" ")}
          >
            {status.label}
          </span>
        </div>

        {/* Title + description */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-loose">
            {project.description}
          </p>
        </div>

        {/* Tech chips */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono text-zinc-500 border border-zinc-200 bg-zinc-50 dark:text-zinc-500 dark:border-white/[0.06] dark:bg-white/[0.02] rounded-md px-2 py-0.5"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-600 self-center">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* CTA row — always visible at the bottom */}
        {hasLinks && (
          <div className="flex items-center gap-3 pt-3 border-t border-zinc-100 dark:border-white/[0.06]">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
              >
                <ExternalLinkIcon /> Live site
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
              >
                <GitHubIcon /> GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories = useMemo<string[]>(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const p of projects) {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        result.push(p.category);
      }
    }
    return result.sort();
  }, [projects]);

  const filtered = useMemo(
    () => (activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter)),
    [activeFilter, projects],
  );

  const countFor = (label: string) =>
    label === "All" ? projects.length : projects.filter((p) => p.category === label).length;

  const hasCategories = categories.length > 0;

  return (
    <section id="projects" className="section-padding max-w-6xl mx-auto" aria-label="Projects">
      {/* Section heading */}
      <motion.div
        variants={headingVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-10"
      >
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600 mb-3">
          04 / Work
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Selected Projects
          </h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-600 font-light">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
            {hasCategories && ` across ${categories.length} disciplines`}
          </p>
        </div>
      </motion.div>

      {/* Filter tabs */}
      {hasCategories && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="flex flex-wrap gap-1.5 mb-10"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {["All", ...categories].map((label) => (
            <FilterTab
              key={label}
              label={label}
              count={countFor(label)}
              active={activeFilter === label}
              onClick={() => setActiveFilter(label)}
            />
          ))}
        </motion.div>
      )}

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <p className="text-sm text-zinc-400 dark:text-zinc-600">No projects in this category yet.</p>
        </motion.div>
      )}
    </section>
  );
}
