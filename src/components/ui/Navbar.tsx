'use client';

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "@/navigation";
import type { Locale } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  logoText: string;
  links: NavLink[];
  locale: Locale;
}

// ─── Language Switcher ────────────────────────────────────────────────────────

function LangToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <span className="w-10 h-8 block" aria-hidden />;

  const nextLocale: Locale = locale === 'ar' ? 'en' : 'ar';

  function handleSwitch() {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button
      onClick={handleSwitch}
      aria-label={`Switch to ${nextLocale === 'ar' ? 'Arabic' : 'English'}`}
      className={[
        "relative flex items-center justify-center h-8 px-2.5 rounded-full",
        "border transition-all duration-300 font-mono text-[11px] font-semibold tracking-widest",
        "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900 hover:bg-zinc-100",
        "dark:border-white/[0.1] dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-white dark:hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <motion.span
        key={locale}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.15 }}
      >
        {nextLocale.toUpperCase()}
      </motion.span>
    </button>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <span className="w-8 h-8 block" aria-hidden />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        "relative w-8 h-8 flex items-center justify-center rounded-full",
        "border transition-all duration-300",
        "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100",
        "dark:border-white/[0.1] dark:hover:border-white/20 dark:hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <MoonIcon />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 30, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -30, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <SunIcon />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar({ logoText = "AA", links = [], locale }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? [
              "backdrop-blur-xl",
              "bg-white/80 border-b border-zinc-200/80 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]",
              "dark:bg-[#08080c]/80 dark:border-white/[0.06] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)]",
            ].join(" ")
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        {/* ── Logo ── */}
        <a
          href="#home"
          className="font-mono text-sm font-semibold tracking-[0.2em] text-zinc-800 hover:text-zinc-900 transition-colors duration-200 dark:text-zinc-100 dark:hover:text-white"
          aria-label="Home"
        >
          {logoText}
        </a>

        {/* ── Desktop Links + Controls ── */}
        <div className="hidden md:flex items-center gap-3">
          <ul className="flex items-center gap-8 me-5" role="list">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200 tracking-wide dark:hover:text-zinc-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <LangToggle locale={locale} />
          <ThemeToggle />
        </div>

        {/* ── Mobile Controls ── */}
        <div className="md:hidden flex items-center gap-3">
          <LangToggle locale={locale} />
          <ThemeToggle />
          <button
            className="relative w-8 h-8 flex flex-col items-center justify-center gap-[5px] group"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={["block h-px w-5 bg-zinc-400 transition-all duration-300 origin-center", menuOpen ? "rotate-45 translate-y-[6px]" : ""].join(" ")} />
            <span className={["block h-px w-5 bg-zinc-400 transition-all duration-300", menuOpen ? "opacity-0 scale-x-0" : ""].join(" ")} />
            <span className={["block h-px w-5 bg-zinc-400 transition-all duration-300 origin-center", menuOpen ? "-rotate-45 -translate-y-[6px]" : ""].join(" ")} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden backdrop-blur-xl border-b bg-white/95 border-zinc-200 dark:bg-[#08080c]/95 dark:border-white/[0.06]"
          >
            <ul
              className="flex flex-col px-6 py-6 gap-5"
              role="list"
              onClick={() => setMenuOpen(false)}
            >
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block text-base text-zinc-500 hover:text-zinc-900 transition-colors duration-200 tracking-wide dark:hover:text-zinc-100"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Inline icons ─────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 dark:text-zinc-400" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
