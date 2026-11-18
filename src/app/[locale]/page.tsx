import type { Metadata } from "next";
import { ArrowRight, BookOpen, FlaskConical, Trophy } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/page";
import { Icon } from "@/components/ui/icons";
import { programs, STAGES } from "@/content/programs";
import { pageMetadata, pick } from "@/lib/i18n";
import { SITE_URL } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { ...pageMetadata(locale, "/", t("defaultTitle"), t("description")), title: { absolute: t("defaultTitle") } };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const st = await getTranslations("stages");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "ResAI",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    description: t("hero.lead"),
    email: "jli@resai.us",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" aria-hidden />
        <div className="pointer-events-none absolute -top-40 right-[-10%] size-[640px] rounded-full bg-gradient-to-br from-brand-200/60 via-amber-brand/20 to-transparent blur-3xl" aria-hidden />
        <div className="container-page relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-sm font-medium text-brand-800">
              <span className="size-1.5 rounded-full bg-brand-500" />
              {t("hero.eyebrow")}
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
              {t("hero.titleA")} <span className="text-gradient-brand">{t("hero.titleB")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{t("hero.lead")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/education" className={buttonClass({ size: "lg" })}>
                {t("hero.primary")} <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/usaaio" className={buttonClass({ variant: "secondary", size: "lg" })}>
                {t("hero.secondary")}
              </Link>
            </div>
          </div>

          <HeroPanel
            title={t("hero.panelTitle")}
            stages={STAGES.map((s) => ({
              key: s,
              label: st(s),
              items: programs.filter((p) => p.stage === s).map((p) => ({ icon: p.icon, label: pick(p.shortTitle, locale) })),
            }))}
          />
        </div>
      </section>

      {/* Pillars */}
      <Section>
        <SectionHeading eyebrow={t("pillars.eyebrow")} title={t("pillars.title")} lead={t("pillars.lead")} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { href: "/education", icon: BookOpen, key: "education" },
            { href: "/usaaio", icon: Trophy, key: "usaaio" },
            { href: "/research", icon: FlaskConical, key: "research" },
          ].map((p) => (
            <Link
              key={p.key}
              href={p.href}
              className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <p.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{t(`pillars.${p.key}.title`)}</h3>
              <p className="mt-2 flex-1 leading-7 text-slate-600">{t(`pillars.${p.key}.body`)}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                {t(`pillars.${p.key}.link`)}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

function HeroPanel({
  title,
  stages,
}: {
  title: string;
  stages: { key: string; label: string; items: { icon: string; label: string }[] }[];
}) {
  return (
    <div className="relative">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-brand-900/5 backdrop-blur sm:p-8">
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <ol className="mt-5 space-y-4">
          {stages.map((s, i) => (
            <li key={s.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-amber-brand text-xs font-bold text-white">{i + 1}</span>
                {i < stages.length - 1 && <span className="mt-1 w-px flex-1 bg-slate-200" />}
              </div>
              <div className="pb-1">
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{s.label}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.items.map((it) => (
                    <span key={it.label} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm text-ink">
                      <Icon name={it.icon} className="size-3.5 text-brand-600" />
                      {it.label}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
