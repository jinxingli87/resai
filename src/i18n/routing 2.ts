import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // English stays the default for everyone; visitors switch languages themselves.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
