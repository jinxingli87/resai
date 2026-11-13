import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download, ExternalLink, Lightbulb } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { PageHero, Section, Tag } from "@/components/ui/page";
import { ProblemPages } from "@/components/usaaio/ProblemPages";
import { getProblemSet, PAST_PROBLEMS_URL, problemSets } from "@/content/usaaio-problems";
import { pageMetadata, pick } from "@/lib/i18n";

const RATIONALE = problemSets.find((s) => s.rationale)!.rationale!;

export function generateStaticParams() {
  return [...problemSets.map((s) => ({ set: s.slug })), { set: RATIONALE.slug }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/usaaio/problems/[set]">): Promise<Metadata> {
  const { locale, set } = await params;
  const t = await getTranslations({ locale, namespace: "problems" });
  if (set === RATIONALE.slug) return pageMetadata(locale, `/usaaio/problems/${set}`, t("rationaleTitle"), t("rationaleBody"));
  const s = getProblemSet(set);
  if (!s) return {};
  return pageMetadata(locale, `/usaaio/problems/${set}`, `USAAIO ${s.year} ${pick(s.round, locale)}`, pick(s.intro, locale));
}

export default async function ProblemSetPage({ params }: PageProps<"/[locale]/usaaio/problems/[set]">) {
  const { locale, set } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("problems");
  const nav = await getTranslations("nav");
  const pageLabel = (n: number) => t("pageN", { n });
  const crumbs = [
    { href: "/", label: nav("home") },
    { href: "/usaaio", label: "USAAIO" },
    { href: "/usaaio/problems", label: t("crumb") },
  ];

  if (set === RATIONALE.slug) {
    return (
      <>
        <PageHero crumbs={[...crumbs, { label: t("rationaleShort") }]} eyebrow="USAAIO 2026" title={t("rationaleTitle")} lead={t("rationaleBody")} />
        <Section className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,760px)_1fr]">
          <ProblemPages slug={RATIONALE.slug} pages={RATIONALE.pages} title={t("rationaleTitle")} pageLabel={pageLabel} />
          <Sidebar pdf={RATIONALE.pdf} official={RATIONALE.officialUrl} pages={RATIONALE.pages} />
        </Section>
      </>
    );
  }

  const s = getProblemSet(set);
  if (!s) notFound();
  const fmt = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { dateStyle: "long", timeZone: "UTC" });
  const total = s.problems.reduce((n, p) => n + p.points, 0);

  return (
    <>
      <PageHero
        crumbs={[...crumbs, { label: `${s.year} ${pick(s.round, locale)}` }]}
        eyebrow={`USAAIO ${s.year}`}
        title={pick(s.round, locale)}
        lead={pick(s.intro, locale)}
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {[
            [t("date"), fmt.format(new Date(s.date))],
            [t("problemCount"), s.problems.length],
            [t("totalPoints"), total],
            [t("pageCount"), s.pages],
          ].map(([l, v]) => (
            <div key={String(l)}>
              <dt className="text-sm text-slate-500">{l}</dt>
              <dd className="mt-0.5 text-lg font-semibold text-ink tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <Section className="pb-0">
        <h2 className="text-2xl font-semibold">{t("atAGlance")}</h2>
        <p className="mt-2 text-sm text-slate-500">{t("summaryNote")}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {s.problems.map((p) => (
            <article key={p.number} className="rounded-2xl border border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold">
                  <span className="mr-1.5 font-mono text-sm text-brand-700">P{p.number}</span>
                  {pick(p.title, locale)}
                </h3>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 tabular-nums">
                  {t("points", { count: p.points })}
                </span>
              </div>
              {p.kind && <p className="mt-1 text-xs font-medium text-brand-700">{t(p.kind === "open-ended" ? "openEnded" : "guided")}</p>}
              <p className="mt-3 leading-7 text-slate-600">{pick(p.summary, locale)}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {pick(p.topics, locale).map((x) => (
                  <Tag key={x}>{x}</Tag>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,760px)_1fr]">
        <div className="min-w-0">
          <h2 className="mb-6 text-2xl font-semibold">{t("officialPages")}</h2>
          {s.showFull ? (
            <ProblemPages slug={s.slug} pages={s.pages} title={`USAAIO ${s.year} ${pick(s.round, locale)}`} pageLabel={pageLabel} />
          ) : (
            <a href={s.officialUrl} target="_blank" rel="noopener noreferrer" className={buttonClass()}>
              {t("openOfficial")} <ExternalLink className="size-4" aria-hidden />
            </a>
          )}
        </div>
        <Sidebar pdf={s.showFull ? s.pdf : null} official={s.officialUrl} rationale={!!s.rationale} pages={s.showFull ? s.pages : 0} />
      </Section>
    </>
  );
}

async function Sidebar({
  pdf,
  official,
  rationale,
  pages = 0,
}: {
  pdf: string | null;
  official: string;
  rationale?: boolean;
  pages?: number;
}) {
  const t = await getTranslations("problems");
  const pageLabel = (n: number) => t("pageN", { n });
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-col gap-2">
          {pdf && (
            <a href={pdf} download className={buttonClass({ size: "sm" })}>
              <Download className="size-4" aria-hidden /> {t("downloadPdf")}
            </a>
          )}
          <a href={official} target="_blank" rel="noopener noreferrer" className={buttonClass({ variant: "secondary", size: "sm" })}>
            {t("officialSource")} <ExternalLink className="size-4" aria-hidden />
          </a>
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-500">
          {t("attribution")}{" "}
          <a href={PAST_PROBLEMS_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">
            usaaio.org
          </a>
        </p>
      </div>
      {rationale && (
        <Link href="/usaaio/problems/2026-round2-rationale" className="flex gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 p-5 hover:border-brand-200">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-brand-700" aria-hidden />
          <span className="text-sm">
            <span className="block font-semibold text-ink">{t("rationaleShort")}</span>
            <span className="mt-0.5 block text-slate-600">{t("rationaleTeaser")}</span>
          </span>
        </Link>
      )}
      {pages > 0 && (
        <nav aria-label={t("jumpToPage")} className="hidden rounded-2xl border border-slate-200 p-5 lg:block">
          <p className="text-sm font-semibold text-slate-500">{t("jumpToPage")}</p>
          <ol className="mt-3 grid grid-cols-6 gap-1.5">
            {Array.from({ length: pages }, (_, i) => (
              <li key={i}>
                <a href={`#page-${i + 1}`} className="grid h-8 place-items-center rounded-md border border-slate-200 text-xs text-slate-600 tabular-nums hover:border-brand-300 hover:text-brand-700" aria-label={pageLabel(i + 1)}>
                  {i + 1}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </aside>
  );
}
