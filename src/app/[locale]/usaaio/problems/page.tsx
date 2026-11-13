import type { Metadata } from "next";
import { ArrowRight, ExternalLink, FileText, Lightbulb } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero, Section, Tag } from "@/components/ui/page";
import { DATASETS_URL, externalSets, PAST_PROBLEMS_URL, problemSets } from "@/content/usaaio-problems";
import { pageMetadata, pick } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/usaaio/problems">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "problems" });
  return pageMetadata(locale, "/usaaio/problems", t("metaTitle"), t("lead"));
}

export default async function ProblemsPage({ params }: PageProps<"/[locale]/usaaio/problems">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("problems");
  const nav = await getTranslations("nav");
  const fmt = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { dateStyle: "long", timeZone: "UTC" });

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: nav("home") }, { href: "/usaaio", label: "USAAIO" }, { label: t("crumb") }]}
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
      />

      <Section>
        <h2 className="text-2xl font-semibold">2026</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {problemSets.map((s) => (
            <Link
              key={s.slug}
              href={`/usaaio/problems/${s.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 p-6 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{pick(s.round, locale)}</h3>
                <FileText className="size-5 text-brand-700" aria-hidden />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {fmt.format(new Date(s.date))} · {t("pages", { count: s.pages })}
              </p>
              <p className="mt-4 leading-7 text-slate-600">{pick(s.intro, locale)}</p>
              <ol className="mt-5 flex-1 space-y-2 border-t border-slate-100 pt-4 text-sm">
                {s.problems.map((p) => (
                  <li key={p.number} className="flex items-baseline justify-between gap-3">
                    <span className="text-ink">
                      <span className="font-mono text-xs text-slate-400">P{p.number}</span> {pick(p.title, locale)}
                    </span>
                    <span className="shrink-0 text-xs text-slate-500 tabular-nums">{t("points", { count: p.points })}</span>
                  </li>
                ))}
              </ol>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                {t("view")} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/usaaio/problems/2026-round2-rationale"
          className="group mt-6 flex items-start gap-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-6 hover:border-brand-200"
        >
          <Lightbulb className="mt-0.5 size-6 shrink-0 text-brand-700" aria-hidden />
          <span>
            <span className="block text-lg font-semibold text-ink">{t("rationaleTitle")}</span>
            <span className="mt-1 block leading-7 text-slate-600">{t("rationaleBody")}</span>
          </span>
          <ArrowRight className="mt-1 ml-auto size-5 shrink-0 text-brand-700 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>

        <h2 className="mt-16 text-2xl font-semibold">2025</h2>
        <p className="mt-2 text-slate-600">{t("external2025")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {externalSets.map((s) => (
            <a
              key={s.key}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 p-5 hover:border-brand-200"
            >
              <span className="font-semibold text-ink">
                {s.year} {pick(s.round, locale)}
              </span>
              <ExternalLink className="size-4 text-slate-400 group-hover:text-brand-700" aria-hidden />
            </a>
          ))}
        </div>

        <div className="mt-16 grid gap-4 rounded-2xl bg-slate-50 p-6 text-sm leading-6 text-slate-600 md:grid-cols-2">
          <p>
            {t("attribution")}{" "}
            <a href={PAST_PROBLEMS_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">
              usaaio.org
            </a>
          </p>
          <p>
            {t("datasets")}{" "}
            <a href={DATASETS_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">
              Hugging Face
            </a>
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Python", "NumPy", "PyTorch", "CNN", "Transformer", "Diffusion", "NLP"].map((x) => (
            <Tag key={x}>{x}</Tag>
          ))}
        </div>
      </Section>
    </>
  );
}
