import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { CtaBand, PageHero, Section, Tag } from "@/components/ui/page";
import { Icon } from "@/components/ui/icons";
import { getProgram, programs } from "@/content/programs";
import { localePath, pageMetadata, pick } from "@/lib/i18n";
import { SITE_URL } from "@/lib/utils";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/education/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProgram(slug);
  if (!p) return {};
  return pageMetadata(locale, `/education/${slug}`, pick(p.title, locale), pick(p.tagline, locale));
}

export default async function ProgramPage({ params }: PageProps<"/[locale]/education/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = getProgram(slug);
  if (!p) notFound();

  const t = await getTranslations("program");
  const st = await getTranslations("stages");
  const nav = await getTranslations("nav");
  const idx = programs.findIndex((x) => x.slug === slug);
  const prev = programs[idx - 1];
  const next = programs[idx + 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: pick(p.title, locale),
    description: pick(p.overview, locale),
    url: `${SITE_URL}${localePath(locale, `/education/${slug}`)}`,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    provider: { "@type": "EducationalOrganization", name: "ResAI", url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        crumbs={[{ href: "/", label: nav("home") }, { href: "/education", label: nav("education") }, { label: pick(p.shortTitle, locale) }]}
        eyebrow={st(p.stage)}
        title={
          <span className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-brand-700 shadow-sm ring-1 ring-brand-100 sm:size-14">
              <Icon name={p.icon} className="size-6 sm:size-7" />
            </span>
            {pick(p.title, locale)}
          </span>
        }
        lead={pick(p.tagline, locale)}
      >
        <Link href="/contact" className={buttonClass({ size: "lg" })}>
          <MessageCircle className="size-4" aria-hidden /> {t("enquire")}
        </Link>
      </PageHero>

      <Section className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-14">
          <div>
            <h2 className="text-2xl font-semibold">{t("overview")}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">{pick(p.overview, locale)}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{t("curriculum")}</h2>
            <ol className="mt-6 space-y-4">
              {p.modules.map((m, i) => (
                <li key={i} className="rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-brand-700">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-lg font-semibold">{pick(m.title, locale)}</h3>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {pick(m.topics, locale).map((topic) => (
                      <Tag key={topic}>{topic}</Tag>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          {p.projects && (
            <div>
              <h2 className="text-2xl font-semibold">{t("projects")}</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {p.projects.map((proj, i) => (
                  <div key={i} className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/40 p-6">
                    <h3 className="text-lg font-semibold">{pick(proj.title, locale)}</h3>
                    <p className="mt-2 flex-1 leading-7 text-slate-600">{pick(proj.description, locale)}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {pick(proj.skills, locale).map((s) => (
                        <Tag key={s} className="bg-white ring-1 ring-slate-200">
                          {s}
                        </Tag>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold">{t("outcomes")}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {pick(p.outcomes, locale).map((o) => (
                <li key={o} className="flex gap-3 leading-7">
                  <Check className="mt-1 size-5 shrink-0 text-brand-600" aria-hidden />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-500">{t("audience")}</h2>
            <p className="mt-2 leading-7">{pick(p.audience, locale)}</p>
            <h2 className="mt-6 text-sm font-semibold text-slate-500">{t("prerequisites")}</h2>
            <p className="mt-2 leading-7">{pick(p.prerequisites, locale)}</p>
          </div>
          <div className="rounded-2xl bg-ink p-6 text-slate-300">
            <h2 className="font-semibold text-white">{t("detailsTitle")}</h2>
            <p className="mt-2 text-sm leading-6">{t("detailsBody")}</p>
            <Link href="/contact" className={buttonClass({ variant: "light", size: "sm", className: "mt-5" })}>
              {t("enquire")}
            </Link>
          </div>
        </aside>
      </Section>

      <nav aria-label={t("morePrograms")} className="container-page grid gap-4 pb-8 sm:grid-cols-2">
        {prev ? (
          <Link href={`/education/${prev.slug}`} className="group rounded-2xl border border-slate-200 p-5 hover:border-brand-200">
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <ArrowLeft className="size-4" aria-hidden /> {t("previous")}
            </span>
            <span className="mt-1 block font-semibold text-ink group-hover:text-brand-800">{pick(prev.title, locale)}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/education/${next.slug}`} className="group rounded-2xl border border-slate-200 p-5 text-right hover:border-brand-200">
            <span className="flex items-center justify-end gap-1.5 text-sm text-slate-500">
              {t("next")} <ArrowRight className="size-4" aria-hidden />
            </span>
            <span className="mt-1 block font-semibold text-ink group-hover:text-brand-800">{pick(next.title, locale)}</span>
          </Link>
        )}
      </nav>

      <div className="pt-12">
        <CtaBand />
      </div>
    </>
  );
}
