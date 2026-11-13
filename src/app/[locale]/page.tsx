import type { Metadata } from "next";
import { ArrowRight, BookOpen, FlaskConical, Map, Trophy } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { CtaBand, Section, SectionHeading } from "@/components/ui/page";
import { Icon } from "@/components/ui/icons";
import { programs, STAGES } from "@/content/programs";
import { humanityAreas, scienceAreas } from "@/content/research";
import { getUsaaioStats } from "@/lib/usaaio-data";
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
  const stats = getUsaaioStats();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "ResAI",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    description: t("hero.lead"),
    email: "foxglobe2023@gmail.com",
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
            stat={{ value: stats.winners, label: t("hero.panelStat", { schools: stats.schools }) }}
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

      {/* Learning path */}
      <section className="border-y border-slate-200/70 bg-slate-50/70">
        <div className="container-page py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow={t("path.eyebrow")} title={t("path.title")} lead={t("path.lead")} />
            <Link href="/education" className={buttonClass({ variant: "secondary", className: "shrink-0" })}>
              {t("path.cta")}
            </Link>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STAGES.map((s, i) => (
              <li key={s} className="relative rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-semibold text-white">{i + 1}</span>
                  <span className="text-sm font-semibold tracking-wide text-brand-700">{st(s)}</span>
                </div>
                <ul className="mt-5 space-y-2">
                  {programs
                    .filter((p) => p.stage === s)
                    .map((p) => (
                      <li key={p.slug}>
                        <Link href={`/education/${p.slug}`} className="group flex items-start gap-3 rounded-xl p-2 -mx-2 hover:bg-brand-50/60">
                          <Icon name={p.icon} className="mt-0.5 size-5 shrink-0 text-brand-600" />
                          <span>
                            <span className="block font-medium text-ink group-hover:text-brand-800">{pick(p.title, locale)}</span>
                            <span className="mt-0.5 block text-sm leading-6 text-slate-500">{pick(p.tagline, locale)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* USAAIO teaser */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={t("usaaio.eyebrow")} title={t("usaaio.title")} lead={t("usaaio.lead")} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/usaaio/statistics" className={buttonClass()}>
                <Map className="size-4" aria-hidden /> {t("usaaio.map")}
              </Link>
              <Link href="/usaaio/problems" className={buttonClass({ variant: "secondary" })}>
                {t("usaaio.problems")}
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/50 p-8">
            <dl className="grid grid-cols-2 gap-6">
              {[
                [stats.winners, t("usaaio.statWinners")],
                [stats.schools, t("usaaio.statSchools")],
                [stats.states, t("usaaio.statStates")],
                [stats.byTier.Camper, t("usaaio.statCampers")],
              ].map(([v, l]) => (
                <div key={String(l)}>
                  <dd className="text-4xl font-semibold tracking-tight text-ink tabular-nums sm:text-5xl">{v}</dd>
                  <dt className="mt-1 text-sm text-slate-500">{l}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">{t("usaaio.source")}</p>
          </div>
        </div>
      </Section>

      {/* Research teaser */}
      <section className="bg-ink text-slate-300">
        <div className="container-page py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-brand-300">{t("research.eyebrow")}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t("research.title")}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">{t("research.lead")}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { key: "science", areas: scienceAreas },
              { key: "humanity", areas: humanityAreas },
            ].map((g) => (
              <div key={g.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <h3 className="text-xl font-semibold text-white">{t(`research.${g.key}`)}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.areas.map((a) => (
                    <li key={a.key} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
                      <Icon name={a.icon} className="size-4 text-brand-300" />
                      {pick(a.title, locale)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link href="/research" className={buttonClass({ variant: "light", className: "mt-10" })}>
            {t("research.cta")} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Who we are */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-wide text-brand-700">{t("who.eyebrow")}</p>
          <p className="mt-4 text-2xl leading-relaxed font-medium text-ink sm:text-3xl">{t("who.statement")}</p>
          <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline">
            {t("who.link")} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

function HeroPanel({
  title,
  stages,
  stat,
}: {
  title: string;
  stages: { key: string; label: string; items: { icon: string; label: string }[] }[];
  stat: { value: number; label: string };
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
      <div className="absolute -top-6 -right-3 hidden rounded-2xl border border-slate-200 bg-white px-5 py-3 text-right shadow-lg sm:block">
        <p className="text-3xl font-semibold tracking-tight text-ink tabular-nums">{stat.value}</p>
        <p className="max-w-48 text-xs text-slate-500">{stat.label}</p>
      </div>
    </div>
  );
}
