import type { Metadata } from "next";
import { ArrowRight, ExternalLink, MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero, Section, SectionHeading } from "@/components/ui/page";
import { IOAI_SITE, ioaiYears } from "@/content/ioai";
import { pageMetadata, pick } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/usaaio/ioai">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ioai" });
  return pageMetadata(locale, "/usaaio/ioai", t("metaTitle"), t("lead"));
}

export default async function IoaiPage({ params }: PageProps<"/[locale]/usaaio/ioai">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ioai");
  const nav = await getTranslations("nav");

  return (
    <>
      <PageHero crumbs={[{ href: "/", label: nav("home") }, { href: "/usaaio", label: "USAAIO" }, { label: "IOAI" }]} eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <Section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {ioaiYears.map((y) => (
            <Link
              key={y.year}
              href={`/usaaio/ioai/${y.year}`}
              className="group flex flex-col rounded-2xl border border-slate-200 p-7 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <p className="text-sm font-semibold text-brand-700">{pick(y.edition, locale)}</p>
              <h2 className="mt-1 text-4xl font-semibold tracking-tight">{y.year}</h2>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="size-4" aria-hidden /> {pick(y.host, locale)}
              </p>
              <p className="mt-4 flex-1 leading-7 text-slate-600">{pick(y.facts, locale)}</p>
              <p className="mt-5 text-sm text-slate-500">
                {t("tasksCount", { count: y.tasks.length })}
                {y.showStatements ? ` · ${t("fullStatements")}` : ""}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                {t("viewTasks")} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid grid-cols-1 gap-10 rounded-3xl bg-slate-50 p-8 sm:p-10 lg:grid-cols-2">
          <SectionHeading title={t("whatTitle")} lead={t("whatBody")} />
          <ul className="space-y-4 self-center">
            {(["w1", "w2", "w3"] as const).map((k) => (
              <li key={k} className="flex gap-3 leading-7">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                {t(`what.${k}`)}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 flex items-center gap-1.5 text-sm text-slate-500">
          {t("officialSite")}{" "}
          <a href={IOAI_SITE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-brand-700 hover:underline">
            ioai-official.org <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </p>
      </Section>
    </>
  );
}
