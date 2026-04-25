'use client';

import { useEffect } from 'react';

interface LocaleApplierProps {
  locale: string;
  dir: 'ltr' | 'rtl';
}

/**
 * Applies locale-aware lang and dir attributes to the root <html> element
 * on every client-side navigation. Without this, Next.js App Router won't
 * update the html tag's attributes when switching locales client-side because
 * the root layout owns <html> and is not locale-aware.
 */
export function LocaleApplier({ locale, dir }: LocaleApplierProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}
