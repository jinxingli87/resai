import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CtaBand, PageHero, SectionHeading } from "@/components/ui/page";
import { Icon } from "@/components/ui/icons";
import { programs, STAGES } from "@/content/programs";
import { pageMetadata, pick } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/education">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "education" });
  return pageMetadata(locale, "/education", t("metaTitle"), t("lead"));
}

export default async function EducationPage({ params }: PageProps<"/[locale]/education">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("education");
  const st = await getTranslations("stages");
  const nav = await getTranslations("nav");

  return (
    <>
      <PageHero crumbs={[{ href: "/", label: nav("home") }, { label: nav("education") }]} eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="border-b border-slate-200/70 bg-slate-50/70">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading eyebrow={t("pathEyebrow")} title={t("pathTitle")} lead={t("pathLead")} />
          <div className="mt-12 space-y-12">
            {STAGES.map((s, i) => (
              <div key={s} className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
                <div>
                  <p className="text-sm font-semibold text-brand-700">
                    {t("stageN", { n: i + 1 })} · {st(s)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{t(`stageBlurb.${s}`)}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {programs
                    .filter((p) => p.stage === s)
                    .map((p) => (
                      <Link
                        key={p.slug}
                        href={`/education/${p.slug}`}
                        className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                            <Icon name={p.icon} className="size-5" />
                          </span>
                          <h3 className="text-lg font-semibold">{pick(p.title, locale)}</h3>
                        </div>
                        <p className="mt-4 flex-1 leading-7 text-slate-600">{pick(p.tagline, locale)}</p>
                        <p className="mt-4 text-sm text-slate-500">
                          {t("modulesCount", { count: p.modules.length })}
                          {p.projects ? ` · ${t("projectsCount", { count: p.projects.length })}` : ""}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                          {t("viewProgram")}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
