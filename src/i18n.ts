import { getRequestConfig } from 'next-intl/server';

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export default getRequestConfig(async ({ requestLocale }) => {
  // Static rendering and routes outside [locale] may not have a locale header.
  // The locale layout validates the URL; request configuration needs a fallback.
  const requestedLocale = await requestLocale;
  const locale = requestedLocale && locales.includes(requestedLocale as Locale)
    ? requestedLocale
    : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
