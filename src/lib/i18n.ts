import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "./utils";

export type Localized<T = string> = { en: T; zh: T };

export function pick<T>(value: Localized<T>, locale: string): T {
  return locale === "zh" ? value.zh : value.en;
}

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

/** Path for a locale, honoring `localePrefix: "as-needed"` (English has no prefix). */
export function localePath(locale: string, path: string) {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale ? clean || "/" : `/${locale}${clean}`;
}

/** Canonical URL and hreflang alternates for a page path such as "/usaaio/problems". */
export function alternates(locale: string, path: string): Metadata["alternates"] {
  return {
    canonical: `${SITE_URL}${localePath(locale, path)}`,
    languages: {
      en: `${SITE_URL}${localePath("en", path)}`,
      "zh-CN": `${SITE_URL}${localePath("zh", path)}`,
      "x-default": `${SITE_URL}${localePath("en", path)}`,
    },
  };
}

export function pageMetadata(locale: string, path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${localePath(locale, path)}`,
      siteName: "ResAI",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "ResAI" }],
    },
  };
}
