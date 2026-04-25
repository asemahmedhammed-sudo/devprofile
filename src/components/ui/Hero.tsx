'use client';

import { motion, type Variants } from "framer-motion";
import type { ProfileData } from "@/types";

interface HeroProps {
  profile: ProfileData;
  resumeUrl?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerLeft: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const photoVariant: Variants = {
  hidden: { opacity: 0, scale: 0.96, x: 30 },
  show:   { opacity: 1, scale: 1,    x: 0,  transition: { duration: 0.9, ease: EASE, delay: 0.2 } },
};

export default function Hero({ profile, resumeUrl = "/resume.pdf" }: HeroProps) {
  const primaryLink = profile.social.find((s) => s.platform === "linkedin");
  const githubLink  = profile.social.find((s) => s.platform === "github");

  return (
    <section
      id="home"
      className="relative flex items-center min-h-screen overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Ambient background glows ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-zinc-300/15 blur-[160px] dark:bg-zinc-700/10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[700px] rounded-full bg-zinc-200/20 blur-[120px] dark:bg-zinc-600/[0.06]" />
      </div>

      <div className="max-w-6xl w-full mx-auto px-6 md:px-12 lg:px-24 pt-28 pb-20">
        {/*
          Two-column layout:
          - Left  (flex-1): all text content
          - Right (fixed width): professional photo
          Stacks to single column on mobile (photo above on sm, hidden on xs)
        */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-14 lg:gap-20">

          {/* ════════════════════════ LEFT — Text ════════════════════════ */}
          <motion.div
            variants={containerLeft}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col items-start gap-6 min-w-0"
          >
            {/* Availability / location badge */}
            <motion.div variants={item}>
              {profile.openToWork ? (
                <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-zinc-500 border border-zinc-300 dark:border-white/[0.08] rounded-full px-4 py-1.5 bg-zinc-100 dark:bg-white/[0.03]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  Available for new roles
                </span>
              ) : (
                <span className="text-xs font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-600">
                  {profile.location}
                </span>
              )}
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={item}
              className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-balance leading-[1.05]"
            >
              <span className="text-gradient">{profile.name}</span>
            </motion.h1>

            {/* Role */}
            <motion.p
              variants={item}
              className="text-xl md:text-2xl text-zinc-500 font-light tracking-wide"
            >
              {profile.role}
            </motion.p>

            {/* Thin divider */}
            <motion.div
              variants={item}
              className="w-12 h-px bg-gradient-to-r from-zinc-400 to-transparent dark:from-zinc-600"
            />

            {/* Tagline */}
            <motion.p
              variants={item}
              className="max-w-lg text-base md:text-lg text-zinc-500 leading-relaxed text-balance"
            >
              {profile.tagline}
            </motion.p>

            {/* Bio */}
            {profile.bio && (
              <motion.p
                variants={item}
                className="max-w-lg text-sm md:text-base text-zinc-400 leading-relaxed"
              >
                {profile.bio}
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-1">
              {primaryLink && (
                <a
                  href={primaryLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium tracking-wide text-white bg-zinc-900 hover:bg-zinc-700 transition-colors duration-200 dark:text-zinc-900 dark:bg-zinc-100 dark:hover:bg-white"
                >
                  {primaryLink.label}
                  <ArrowRightIcon />
                </a>
              )}
              {githubLink && (
                <a
                  href={githubLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium tracking-wide text-zinc-600 border border-zinc-300 hover:border-zinc-400 hover:text-zinc-900 transition-all duration-200 dark:text-zinc-400 dark:border-white/[0.1] dark:hover:border-white/20 dark:hover:text-zinc-200"
                >
                  {githubLink.label}
                </a>
              )}
              <a
                href={resumeUrl}
                download
                aria-label={`Download ${profile.name}'s CV`}
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium tracking-wide text-zinc-400 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-700 hover:bg-zinc-50 transition-all duration-300 dark:text-zinc-500 dark:border-white/[0.07] dark:hover:border-white/[0.18] dark:hover:text-zinc-200 dark:hover:bg-white/[0.03]"
              >
                <DownloadIcon />
                Download CV
              </a>
            </motion.div>

            {/* Location (only shown when open to work — shows below CTA) */}
            {profile.openToWork && (
              <motion.p
                variants={item}
                className="text-xs font-mono text-zinc-400 dark:text-zinc-600 tracking-widest uppercase"
              >
                {profile.location}
              </motion.p>
            )}
          </motion.div>

          {/* ════════════════════════ RIGHT — Photo ════════════════════════ */}
          {profile.avatarUrl && (
            <motion.div
              variants={photoVariant}
              initial="hidden"
              animate="show"
              className="relative shrink-0 w-64 sm:w-72 lg:w-80 xl:w-[340px]"
            >
              {/*
                Decorative offset frame — renders a border rectangle
                slightly behind and offset from the photo for depth.
              */}
              <div
                aria-hidden
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-zinc-200 dark:border-white/[0.07]"
              />

              {/* Subtle background glow behind the photo */}
              <div
                aria-hidden
                className="absolute -inset-4 rounded-3xl bg-zinc-100/60 blur-2xl dark:bg-zinc-800/20 -z-10"
              />

              {/* Photo container */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-zinc-200/60 dark:shadow-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top"
                  style={{ aspectRatio: '3 / 4' }}
                />

                {/* Very subtle bottom gradient fade — name badge */}
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium tracking-wide drop-shadow">{profile.name}</p>
                  <p className="text-white/70 text-xs font-light tracking-wide drop-shadow">{profile.role}</p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden
      >
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-700">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-zinc-400 to-transparent dark:from-zinc-700"
        />
      </motion.div>
    </section>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-[1px]">
      <path d="M6.5 1v7M3.5 5.5l3 3 3-3M1.5 10.5h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
