'use client';

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion, type Variants } from "framer-motion";
import { submitContactForm, type ContactFormState } from "@/actions/contact";
import type { SocialLink } from "@/types";

interface FooterProps {
  name: string;
  email: string;
  social: SocialLink[];
  ctaHeading?: string;
  ctaSubtext?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

// ─── Social icons ─────────────────────────────────────────────────────────────

const SOCIAL_ICONS: Partial<Record<SocialLink["platform"], React.ReactNode>> = {
  github: (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

// ─── Submit button ─────────────────────────────────────────────────────────────

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={[
        "self-start inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-medium tracking-wide",
        "border transition-all duration-300",
        pending
          ? "opacity-50 cursor-not-allowed border-zinc-200 text-zinc-400 dark:border-white/[0.05] dark:text-zinc-600"
          : [
              "border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100",
              "dark:border-white/[0.1] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/[0.04]",
            ].join(" "),
      ].join(" ")}
    >
      {pending ? (
        <><SpinnerIcon />Sending…</>
      ) : (
        "Send Message"
      )}
    </button>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────

const INITIAL_STATE: ContactFormState = { status: "idle", message: "" };

function ContactForm() {
  const [state, action] = useFormState(submitContactForm, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.status === "success") formRef.current?.reset();
  }, [state?.status]);

  const status  = state?.status  ?? "idle";
  const message = state?.message ?? "";

  const inputBase = [
    "w-full rounded-xl px-4 py-3 text-sm",
    "border border-zinc-200 bg-white text-zinc-800 placeholder-zinc-400",
    "focus:outline-none focus:border-zinc-400 focus:bg-white",
    "transition-all duration-200",
    "dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-300 dark:placeholder-zinc-700",
    "dark:focus:border-white/20 dark:focus:bg-white/[0.05]",
  ].join(" ");

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-3 w-full max-w-md" aria-label="Contact form">
      <input id="contact-name"    name="name"    type="text"  placeholder="Your name"      autoComplete="name"  required className={inputBase} />
      <input id="contact-email"   name="email"   type="email" placeholder="Email address"  autoComplete="email" required className={inputBase} />
      <textarea id="contact-message" name="message" placeholder="Tell me about the role or project…" rows={4} required className={`${inputBase} resize-none`} />

      <div className="flex items-center gap-4 mt-1">
        <SubmitButton />
        {status !== "idle" && (
          <p role="status" aria-live="polite" className={["text-xs font-mono tracking-wide", status === "success" ? "text-emerald-600 dark:text-emerald-500/80" : "text-red-500 dark:text-red-400/80"].join(" ")}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function Footer({
  name,
  email,
  social,
  ctaHeading = "Let's build something extraordinary.",
  ctaSubtext = "Open to senior roles, consulting, and ambitious side projects.",
}: FooterProps) {
  const year = new Date().getFullYear();
  const renderedSocials = social.filter((s) => s.platform !== "email" && SOCIAL_ICONS[s.platform]);

  return (
    <footer
      id="contact"
      className="relative border-t border-zinc-200 dark:border-white/[0.06]"
      aria-label="Contact and footer"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-zinc-100/30 dark:to-white/[0.01]"
      />

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-start gap-10"
        >
          {/* ── CTA heading ── */}
          <motion.div variants={itemVariants} className="max-w-xl">
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600 mb-5">
              05 / Contact
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance text-zinc-900 dark:text-zinc-100 leading-tight mb-4">
              {ctaHeading}
            </h2>
            <p className="text-zinc-500 leading-relaxed">{ctaSubtext}</p>
          </motion.div>

          {/* ── Two-column: email + form ── */}
          <motion.div variants={itemVariants} className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Email direct link */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-mono text-zinc-400 dark:text-zinc-700 tracking-widest uppercase">
                Or reach out directly
              </p>
              <a
                href={`mailto:${email}`}
                className="group inline-flex items-center gap-3 text-zinc-500 hover:text-zinc-900 transition-colors duration-300 w-fit dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <span className="text-lg md:text-xl font-light tracking-wide underline underline-offset-4 decoration-zinc-300 group-hover:decoration-zinc-500 transition-colors duration-300 dark:decoration-zinc-700 dark:group-hover:decoration-zinc-400">
                  {email}
                </span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <path d="M3 9h12M9.5 3.5L15 9l-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <ContactForm />
          </motion.div>

          {/* ── Divider ── */}
          <motion.div variants={itemVariants} className="w-full h-px bg-zinc-200 dark:bg-gradient-to-r dark:from-white/[0.06] dark:via-white/[0.04] dark:to-transparent" />

          {/* ── Bottom bar ── */}
          <motion.div variants={itemVariants} className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="text-xs font-mono text-zinc-400 dark:text-zinc-700 tracking-wide">
              © {year} {name}. Crafted with intent.
            </p>
            <div className="flex items-center gap-5">
              {renderedSocials.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors duration-200 dark:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {SOCIAL_ICONS[link.platform]}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

function SpinnerIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="animate-spin">
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  );
}
