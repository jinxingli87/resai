"use client";

import { useSyncExternalStore } from "react";
import { Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const STORAGE_KEY = "resai-ai-notice-dismissed";
const EVENT = "resai-ai-notice";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function AiTranslationNotice() {
  const t = useTranslations("aiNotice");
  const pathname = usePathname();
  const dismissed = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(STORAGE_KEY) === "1",
    () => false,
  );

  if (dismissed) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 text-amber-950">
      <div className="container-page flex items-center gap-3 py-2 text-sm">
        <Sparkles className="size-4 shrink-0 text-amber-600" aria-hidden />
        <p className="flex-1">
          {t("text")}{" "}
          <Link href={pathname} locale="en" lang="en" className="font-medium underline underline-offset-2">
            {t("viewEnglish")}
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "1");
            window.dispatchEvent(new Event(EVENT));
          }}
          aria-label={t("dismiss")}
          className="rounded p-1 text-amber-800 hover:bg-amber-100"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
