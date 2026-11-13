import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/ui/page";
import { Icon } from "@/components/ui/icons";
import { humanityAreas, scienceAreas, type ResearchArea } from "@/content/research";
import { pageMetadata, pick } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/research">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "research" });
  return pageMetadata(locale, "/research", t("metaTitle"), t("lead"));
}

export default async function ResearchPage({ params }: PageProps<"/[locale]/research">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("research");
  const nav = await getTranslations("nav");

  return (
    <>
      <PageHero crumbs={[{ href: "/", label: nav("home") }, { label: nav("research") }]} eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <AreaGroup id="science" title={t("scienceTitle")} areas={scienceAreas} locale={locale} ideasLabel={t("ideas")} tinted />
      <AreaGroup id="humanity" title={t("humanityTitle")} lead={t("humanityLead")} areas={humanityAreas} locale={locale} ideasLabel={t("ideas")} />

      <Section className="pt-0">
        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-600">{t("note")}</p>
      </Section>

      <CtaBand title={t("ctaTitle")} lead={t("ctaLead")} />
    </>
  );
}

function AreaGroup({
  id,
  title,
  lead,
  areas,
  locale,
  ideasLabel,
  tinted,
}: {
  id: string;
  title: string;
  lead?: string;
  areas: ResearchArea[];
  locale: string;
  ideasLabel: string;
  tinted?: boolean;
}) {
  return (
    <section id={id} className={tinted ? "border-y border-slate-200/70 bg-slate-50/70" : undefined}>
      <div className="container-page py-16 sm:py-20">
        <SectionHeading title={title} lead={lead} />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => (
            <article key={a.key} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Icon name={a.icon} className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{pick(a.title, locale)}</h3>
              <p className="mt-2 leading-7 text-slate-600">{pick(a.description, locale)}</p>
              <h4 className="mt-5 text-xs font-semibold tracking-wide text-slate-500 uppercase">{ideasLabel}</h4>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700">
                {pick(a.ideas, locale).map((idea) => (
                  <li key={idea} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                    {idea}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
