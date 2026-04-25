/**
 * Bilingual navigation utilities wrapping next-intl.
 * Import Link, useRouter, usePathname from here — never from next/navigation directly.
 */
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from './i18n';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
