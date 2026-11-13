import type { Metadata } from "next";
import { ArrowRight, CalendarDays, CheckCircle2, ExternalLink, FileText, Globe2, Map } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/ui/page";
import { Icon } from "@/components/ui/icons";
import { getProgram } from "@/content/programs";
import { getUsaaioStats } from "@/lib/usaaio-data";
import { pageMetadata, pick } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/usaaio">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "usaaio" });
  return pageMetadata(locale, "/usaaio", t("metaTitle"), t("lead"));
}

export default async function UsaaioPage({ params }: PageProps<"/[locale]/usaaio">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("usaaio");
  const nav = await getTranslations("nav");
  const stats = getUsaaioStats();
  const prep = ["math-for-ai", "machine-learning", "computer-vision", "llms"].map((s) => getProgram(s)!);

  return (
    <>
      <PageHero crumbs={[{ href: "/", label: nav("home") }, { label: "USAAIO" }]} eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")}>
        <div className="flex flex-wrap gap-3">
          <Link href="/usaaio/statistics" className={buttonClass({ size: "lg" })}>
            <Map className="size-4" aria-hidden /> {t("statsCta", { count: stats.winners })}
          </Link>
          <Link href="/usaaio/problems" className={buttonClass({ variant: "secondary", size: "lg" })}>
            {t("problemsCta")}
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500">{t("disclaimer")}</p>
      </PageHero>

      <Section>
        <SectionHeading eyebrow={t("pathEyebrow")} title={t("pathTitle")} lead={t("pathLead")} />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(["r1", "r2", "camp", "team"] as const).map((k, i) => (
            <li key={k} className="relative rounded-2xl border border-slate-200 p-6">
              <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-amber-brand text-sm font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold">{t(`path.${k}.title`)}</h3>
              <p className="mt-1 text-sm font-medium text-brand-700">{t(`path.${k}.when`)}</p>
              <p className="mt-3 leading-7 text-slate-600">{t(`path.${k}.body`)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <section className="border-y border-slate-200/70 bg-slate-50/70">
        <div className="container-page grid gap-6 py-16 sm:py-20 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <CheckCircle2 className="size-6 text-brand-700" aria-hidden />
            <h2 className="mt-4 text-xl font-semibold">{t("eligibilityTitle")}</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              {(["e1", "e2", "e3"] as const).map((k) => (
                <li key={k} className="flex gap-2 leading-7">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                  {t(`eligibility.${k}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <CalendarDays className="size-6 text-brand-700" aria-hidden />
            <h2 className="mt-4 text-xl font-semibold">{t("datesTitle")}</h2>
            <dl className="mt-4 divide-y divide-slate-100">
              {(["registration", "round1", "round2", "camp"] as const).map((k) => (
                <div key={k} className="grid grid-cols-[1fr_auto] gap-4 py-2.5 text-sm">
                  <dt className="text-slate-500">{t(`dates.${k}.label`)}</dt>
                  <dd className="text-right font-medium text-ink">{t(`dates.${k}.value`)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-slate-500">{t("datesNote")}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <FileText className="size-6 text-brand-700" aria-hidden />
            <h2 className="mt-4 text-xl font-semibold">{t("formatTitle")}</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              {(["f1", "f2", "f3"] as const).map((k) => (
                <li key={k} className="flex gap-2 leading-7">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                  {t(`format.${k}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow={t("exploreEyebrow")} title={t("exploreTitle")} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { href: "/usaaio/problems", icon: FileText, key: "problems" },
            { href: "/usaaio/statistics", icon: Map, key: "statistics" },
            { href: "/usaaio/ioai", icon: Globe2, key: "ioai" },
          ].map((c) => (
            <Link key={c.key} href={c.href} className="group flex flex-col rounded-2xl border border-slate-200 p-7 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5">
              <c.icon className="size-6 text-brand-700" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">{t(`explore.${c.key}.title`)}</h3>
              <p className="mt-2 flex-1 leading-7 text-slate-600">{t(`explore.${c.key}.body`)}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                {t("open")} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/70 to-white p-8 sm:p-10">
          <SectionHeading eyebrow={t("prepEyebrow")} title={t("prepTitle")} lead={t("prepLead")} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {prep.map((p) => (
              <Link key={p.slug} href={`/education/${p.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-200">
                <Icon name={p.icon} className="size-5 text-brand-700" />
                <p className="mt-3 font-semibold text-ink group-hover:text-brand-800">{pick(p.title, locale)}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{pick(p.tagline, locale)}</p>
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-6 flex items-center gap-1.5 text-sm text-slate-500">
          {t("officialSite")}{" "}
          <a href="https://www.usaaio.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-brand-700 hover:underline">
            usaaio.org <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </p>
      </Section>

      <CtaBand />
    </>
  );
}
