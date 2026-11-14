import type { MetadataRoute } from "next";
import { programs } from "@/content/programs";
import { problemSets } from "@/content/usaaio-problems";
import { ioaiYears } from "@/content/ioai";
import { localePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/education",
    ...programs.map((p) => `/education/${p.slug}`),
    "/research",
    "/about",
    "/contact",
    "/usaaio",
    "/usaaio/problems",
    ...problemSets.map((s) => `/usaaio/problems/${s.slug}`),
    "/usaaio/problems/2026-round2-rationale",
    "/usaaio/statistics",
    "/usaaio/ioai",
    ...ioaiYears.map((y) => `/usaaio/ioai/${y.year}`),
  ];
  return paths.map((p) => ({
    url: `${SITE_URL}${localePath("en", p)}`,
    alternates: {
      languages: {
        en: `${SITE_URL}${localePath("en", p)}`,
        "zh-CN": `${SITE_URL}${localePath("zh", p)}`,
      },
    },
  }));
}
