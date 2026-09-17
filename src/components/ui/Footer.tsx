'use client';

import { useTranslations } from "next-intl";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { SocialLink } from "@/types";

const contactFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

interface FooterProps {
  name: string;
  email: string;
  social: SocialLink[];
  whatsappUrl: string;
  whatsappDisplay: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SOCIAL_ICONS: Partial<Record<SocialLink["platform"], React.ReactNode>> = {
  github: (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

interface ContactCardProps {
  href: string;
  external?: boolean;
  icon: React.ReactNode;
  label: string;
  category: string;
  description: string;
  action: string;
  value: string;
  accent?: "emerald";
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 5V3H3v12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ContactCard({ href, external, icon, label, category, description, action, value, accent }: ContactCardProps) {
  const t = useTranslations("footer");
  const isEmerald = accent === "emerald";
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyState("idle"), 3000);
  }

  return (
    <motion.article
      variants={card}
      className={[
        "group flex min-w-0 flex-col rounded-3xl border bg-white p-6 shadow-sm transition-[border-color,box-shadow] duration-300 sm:p-8",
        "dark:bg-white/[0.025] dark:shadow-none",
        isEmerald
          ? "border-emerald-200/70 hover:border-emerald-300 dark:border-emerald-500/20 dark:hover:border-emerald-500/35"
          : "border-zinc-200 hover:border-zinc-300 dark:border-white/10 dark:hover:border-white/20",
      ].join(" ")}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className={[
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border",
          isEmerald
            ? "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300",
        ].join(" ")}>{icon}</div>
        <span className={[
          "rounded-full border px-3 py-1 text-xs font-medium",
          isEmerald
            ? "border-emerald-100 bg-emerald-50 text-emerald-800 dark:border-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-300"
            : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400",
        ].join(" ")}>{category}</span>
      </div>
      <h3 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{label}</h3>
      <p className="mb-7 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
      <div className="mt-auto">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-white/5 dark:bg-white/[0.03]">
          <span dir="ltr" className={[
            "min-w-0 select-all break-all font-mono font-medium text-zinc-900 dark:text-zinc-200",
            isEmerald ? "text-2xl tracking-wide" : "text-sm sm:text-base",
          ].join(" ")}>{value}</span>
          <button
            type="button"
            onClick={copyValue}
            aria-label={t(isEmerald ? "copyPhone" : "copyEmail")}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            <CopyIcon />
            <span>{t(copyState === "copied" ? "copied" : "copy")}</span>
          </button>
        </div>
        <p role="status" aria-live="polite" className="min-h-8 py-1 text-xs text-zinc-600 dark:text-zinc-400">
          {copyState === "copied" ? t("copySuccess") : copyState === "error" ? t("copyError") : ""}
        </p>
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={[
            "inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl px-4 py-3 text-center text-sm font-semibold transition-colors duration-200 sm:text-base",
            isEmerald
              ? "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600"
              : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
          ].join(" ")}
        >
          <span>{action}</span>
          <ArrowIcon className="shrink-0 rtl:rotate-180" />
        </a>
      </div>
    </motion.article>
  );
}

export default function Footer({ name, email, social, whatsappUrl, whatsappDisplay }: FooterProps) {
  const t = useTranslations("footer");
  const reduceMotion = useReducedMotion();
  const year = new Date().getFullYear();
  const renderedSocials = social.filter((s) => s.platform !== "email" && SOCIAL_ICONS[s.platform]);

  return (
    <footer id="contact" aria-labelledby="contact-heading" className={`${contactFont.className} relative isolate scroll-mt-24 overflow-hidden border-t border-zinc-200 bg-zinc-50/70 dark:border-white/[0.06] dark:bg-[#08080c]`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 end-0 h-96 w-96 rounded-full bg-emerald-100/30 blur-[100px] dark:bg-emerald-950/20" />
      </div>
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-24 lg:px-24">
        <motion.div
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={item} className="mb-10 md:mb-12">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                {t("sectionLabel")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:border-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-300">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                {t("availability")}
              </span>
            </div>
            <h2 id="contact-heading" className="mb-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.3] tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-6xl">{t("ctaHeading")}</h2>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-lg">{t("ctaSubtext")}</p>
          </motion.div>
          <motion.div variants={container} className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <ContactCard
              href={whatsappUrl} external accent="emerald" icon={<WhatsAppIcon />}
              label={t("whatsappLabel")} category={t("whatsappCategory")}
              description={t("whatsappDescription")} action={t("whatsappAction")} value={whatsappDisplay}
            />
            {email && (
              <ContactCard
                href={`mailto:${email}`} icon={<EmailIcon />}
                label={t("emailTitle")} category={t("emailLabel")}
                description={t("emailDescription")} action={t("emailAction")} value={email}
              />
            )}
          </motion.div>
          {renderedSocials.length > 0 && (
            <motion.div variants={item} className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{t("socialLabel")}</p>
              <div className="flex flex-wrap items-center gap-3">
                {renderedSocials.map((link) => (
                  <a
                    key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}
                    className="inline-flex min-h-11 items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-white/25 dark:hover:text-white"
                  >
                    {SOCIAL_ICONS[link.platform]}
                    <span>{link.platform === "github" ? "GitHub" : "LinkedIn"}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      <div className="border-t border-zinc-200/80 dark:border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center justify-between gap-4 px-6 py-6 text-xs text-zinc-500 dark:text-zinc-400 sm:flex-row md:px-12 lg:px-24">
          <p className="text-center">© {year} <span className="font-medium text-zinc-700 dark:text-zinc-300">{name}</span>. {t("crafted")}</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" })} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-zinc-100">
            {t("backToTop")} <span aria-hidden="true" className="text-lg">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
