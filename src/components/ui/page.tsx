import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  crumbs?: { href?: string; label: string }[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-brand-50/60 to-white", className)}>
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="container-page relative py-14 sm:py-20">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="text-sm font-semibold tracking-wide text-brand-700">{eyebrow}</p>}
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {lead && <div className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{lead}</div>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5 text-slate-400" aria-hidden />}
            {c.href ? (
              <Link href={c.href} className="hover:text-brand-700">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-slate-700">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Section({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={cn("container-page scroll-mt-24 py-16 sm:py-20", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="text-sm font-semibold tracking-wide text-brand-700">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {lead && <p className="mt-4 text-lg leading-8 text-slate-600">{lead}</p>}
    </div>
  );
}

export async function CtaBand({ title, lead }: { title?: string; lead?: string }) {
  const t = await getTranslations("cta");
  return (
    <section className="container-page">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-500/40 to-amber-brand/20 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title ?? t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{lead ?? t("lead")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className={buttonClass({ variant: "light", size: "lg" })}>
              {t("contact")}
            </Link>
            <Link href="/education" className={buttonClass({ variant: "secondary", size: "lg", className: "border-white/20 bg-white/5 text-white hover:bg-white/10" })}>
              {t("programs")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700", className)}>
      {children}
    </span>
  );
}
