"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("lang");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-sm"
    >
      {!compact && <Languages className="ml-2 mr-1 size-4 text-slate-400" aria-hidden />}
      {(["en", "zh"] as const).map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={l === "zh" ? "zh-CN" : "en"}
          aria-current={locale === l ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1 font-medium transition-colors",
            locale === l ? "bg-ink text-white" : "text-slate-600 hover:text-ink",
          )}
        >
          {l === "en" ? "EN" : "中文"}
        </Link>
      ))}
    </div>
  );
}
