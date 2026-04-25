'use client';

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Wraps next-themes ThemeProvider.
 * The div with suppressHydrationWarning prevents the removeChild crash
 * caused by next-themes injecting an inline script into the body during SSR
 * that React can't reconcile in Next.js 14 App Router.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="devprofile-theme"
      {...props}
    >
      <div suppressHydrationWarning style={{ display: 'contents' }}>
        {children}
      </div>
    </NextThemesProvider>
  );
}
