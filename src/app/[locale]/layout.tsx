import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AiTranslationNotice } from "@/components/layout/AiTranslationNotice";
import { alternates } from "@/lib/i18n";
import { SITE_URL } from "@/lib/utils";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/** Namespaces used by client components; everything else stays on the server. */
const CLIENT_NAMESPACES = ["nav", "lang", "aiNotice", "common", "map", "notFound"] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("defaultTitle"), template: `%s · ResAI` },
    description: t("description"),
    alternates: alternates(locale, "/"),
    openGraph: {
      siteName: "ResAI",
      title: t("defaultTitle"),
      description: t("description"),
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "ResAI" }],
    },
    twitter: { card: "summary_large_image" },
    icons: { apple: "/apple-icon.png" },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider messages={clientMessages}>
          <a
            href="#main"
            className="sr-only z-[100] rounded-md bg-white px-4 py-2 text-sm font-medium text-ink shadow focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {t("skipToContent")}
          </a>
          <Header />
          {locale === "zh" && <AiTranslationNotice />}
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
