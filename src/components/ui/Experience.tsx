'use client';

import { motion, type Variants } from "framer-motion";
import type { WorkExperience } from "@/types";

interface ExperienceProps {
  experience: WorkExperience[];
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function ExperienceCard({ job, isLast }: { job: WorkExperience; isLast: boolean }) {
  return (
    <motion.li variants={cardVariants} className="relative flex gap-6 md:gap-8">
      {/* ── Timeline spine ── */}
      <div className="relative flex flex-col items-center flex-shrink-0 w-px">
        {/* Node dot */}
        <span className="mt-[6px] flex-shrink-0 w-2 h-2 rounded-full bg-zinc-400 ring-4 ring-zinc-50 z-10 dark:bg-zinc-500 dark:ring-[#08080c]" />
        {/* Connecting line */}
        {!isLast && (
          <span className="flex-1 w-px bg-gradient-to-b from-zinc-300/80 to-transparent mt-2 dark:from-zinc-700/60" />
        )}
      </div>

      {/* ── Card ── */}
      <div className="flex-1 pb-12 last:pb-0">
        {/* Date range */}
        <p className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-600 mb-3">
          {job.startDate} — {job.endDate}
        </p>

        {/* Position + Company */}
        <div className="mb-5">
          <h3 className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {job.position}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            {job.companyUrl ? (
              <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-blue-500/50">
                {job.company}
              </a>
            ) : (
              <span className="text-sm text-zinc-500 font-light">{job.company}</span>
            )}
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
            {job.description.split(/•|\n/).map((line, idx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              return (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="text-zinc-400 dark:text-zinc-600 mt-0.5 text-[10px]">❖</span>
                  <span className="flex-1">{trimmed}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Tech stack chips */}
        {job.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {job.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono text-zinc-500 border border-zinc-200 bg-zinc-50 rounded-md px-2.5 py-1 tracking-wide dark:text-zinc-600 dark:border-white/[0.06] dark:bg-white/[0.02]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.li>
  );
}

export default function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className="section-padding max-w-6xl mx-auto" aria-label="Work Experience">
      <motion.div
        variants={headingVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-14"
      >
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600 mb-3">
          03 / Experience
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Work History
        </h2>
      </motion.div>

      <motion.ul
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="flex flex-col pl-4"
        role="list"
        aria-label="Experience timeline"
      >
        {experience.map((job, i) => (
          <ExperienceCard
            key={`${job.company}-${job.startDate}`}
            job={job}
            isLast={i === experience.length - 1}
          />
        ))}
      </motion.ul>
    </section>
  );
}
