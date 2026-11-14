"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { CONTACT_EMAIL_PARTS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** The address is assembled in the browser so it isn't sitting in the HTML for scrapers. */
export function EmailLink({ className, showIcon = false }: { className?: string; showIcon?: boolean }) {
  const mounted = useMounted();
  const [user, domain] = CONTACT_EMAIL_PARTS;
  if (!mounted) {
    return (
      <span className={className}>
        {user} [at] {domain}
      </span>
    );
  }
  const email = `${user}@${domain}`;
  return (
    <a href={`mailto:${email}`} className={cn("inline-flex items-center gap-2", className)}>
      {showIcon && <Mail className="size-4" aria-hidden />}
      {email}
    </a>
  );
}

export function CopyButton({ value, label, className }: { value: "email" | string; label?: string; className?: string }) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);
  const text = value === "email" ? CONTACT_EMAIL_PARTS.join("@") : value;
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard unavailable (e.g. insecure context) */
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50",
        className,
      )}
      aria-label={label ? `${t("copy")} ${label}` : t("copy")}
    >
      {copied ? <Check className="size-4 text-emerald-600" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
    </button>
  );
}
