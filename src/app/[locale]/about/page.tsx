import type { Metadata } from "next";
import { BookOpen, FlaskConical, Trophy } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/ui/page";
import { pageMetadata } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata(locale, "/about", t("metaTitle"), t("cofounded"));
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const nav = await getTranslations("nav");

  return (
    <>
      <PageHero crumbs={[{ href: "/", label: nav("home") }, { label: nav("about") }]} eyebrow={t("eyebrow")} title={t("title")} lead={t("cofounded")} />

      <Section className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow={t("missionEyebrow")} title={t("missionTitle")} />
          <p className="mt-6 text-lg leading-8 text-slate-600">{t("missionBody1")}</p>
          <p className="mt-4 text-lg leading-8 text-slate-600">{t("missionBody2")}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { icon: BookOpen, key: "education" },
            { icon: Trophy, key: "olympiad" },
            { icon: FlaskConical, key: "research" },
          ].map((w) => (
            <div key={w.key} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
              <w.icon className="mt-0.5 size-5 shrink-0 text-brand-700" aria-hidden />
              <div>
                <h3 className="font-semibold">{t(`what.${w.key}.title`)}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{t(`what.${w.key}.body`)}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand title={t("ctaTitle")} lead={t("ctaLead")} />
    </>
  );
}
