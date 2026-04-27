import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocaleApplier } from "@/components/LocaleApplier";
import { locales, type Locale } from "@/i18n";

// ─── Metadata ─────────────────────────────────────────────────────────────────

const SITE_URL = "https://asemahmed.dev";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isAr = params.locale === "ar";

  const title = isAr
    ? "عاصم أحمد — مهندس برمجيات أول"
    : "Asem Ahmed — Senior Software Engineer";
  const description = isAr
    ? "ملف أعمال المهندس عاصم أحمد — مهندس برمجيات أول متخصص في تطوير الأنظمة الكاملة، أدوات المطورين، التطبيقات المدعومة بالذكاء الاصطناعي والبنية التحتية السحابية."
    : "Portfolio of Eng. Asem Ahmed — Senior Software Engineer specialising in full-stack systems, developer tooling, AI-powered applications, and scalable cloud infrastructure.";

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${isAr ? "عاصم أحمد" : "Asem Ahmed"}` },
    description,
    alternates: {
      canonical: SITE_URL,
      languages: { en: `${SITE_URL}/en`, ar: `${SITE_URL}/ar` },
    },
    openGraph: {
      type: "profile",
      locale: isAr ? "ar_EG" : "en_US",
      url: SITE_URL,
      title,
      description,
      siteName: isAr ? "عاصم أحمد" : "Asem Ahmed",
    },
    twitter: {
      card: "summary_large_image",
      site: "@asem_ahmed",
      creator: "@asem_ahmed",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#08080c" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Asem Ahmed",
  jobTitle: "Senior Software Engineer",
  url: SITE_URL,
  sameAs: [
    "https://github.com/asem-ahmed",
    "https://linkedin.com/in/asem-ahmed",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider locale={locale as Locale} messages={messages}>
      <ThemeProvider>
        {/* Updates html lang + dir on every client-side locale navigation */}
        <LocaleApplier locale={locale} dir={dir} />
        {children}
      </ThemeProvider>
      <Script
        id="json-ld-person"
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="afterInteractive"
      />
    </NextIntlClientProvider>
  );
}
