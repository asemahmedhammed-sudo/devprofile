import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale from the request (new API in next-intl ^3.22)
  const locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
