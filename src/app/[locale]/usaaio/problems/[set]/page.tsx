import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Download, ExternalLink, Lightbulb } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Markdown } from "@/components/content/Markdown";
import { buttonClass } from "@/components/ui/button";
import { PageHero, Section, Tag } from "@/components/ui/page";
import { getProblemSet, PAST_PROBLEMS_URL, problemSets, type Problem } from "@/content/usaaio-problems";
import { loadDocument, loadStatements, type StatementPart, type StatementProblem } from "@/lib/usaaio-statements";
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

const partId = (n: number, label: string) => `p${n}-part-${label.replace(/\./g, "-")}`;

export default async function ProblemSetPage({ params }: PageProps<"/[locale]/usaaio/problems/[set]">) {
  const { locale, set } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("problems");
  const nav = await getTranslations("nav");
  const crumbs = [
    { href: "/", label: nav("home") },
    { href: "/usaaio", label: nav("usaaio") },
    { href: "/usaaio/problems", label: t("crumb") },
  ];

  if (set === RATIONALE.slug) {
    const doc = loadDocument(RATIONALE.slug);
    if (!doc) notFound();
    return (
      <>
        <PageHero crumbs={[...crumbs, { label: t("rationaleShort") }]} eyebrow="USAAIO 2026" title={t("rationaleTitle")} lead={t("rationaleBody")}>
          <SourceLinks pdf={RATIONALE.pdf} official={RATIONALE.officialUrl} />
        </PageHero>
        <Section className="max-w-4xl">
          {locale === "zh" && <EnglishNote />}
          <Markdown source={doc} />
          <Attribution />
        </Section>
      </>
    );
  }

  const s = getProblemSet(set);
  if (!s) notFound();
  const statements = loadStatements(s.slug);
  if (!statements) notFound();
  const meta = new Map(s.problems.map((p) => [p.number, p]));
  const fmt = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { dateStyle: "long", timeZone: "UTC" });
  const total = s.problems.reduce((n, p) => n + p.points, 0);
  const partCount = statements.problems.reduce((n, p) => n + p.parts.length, 0);

  const stats: [string, string | number][] = [
    ...(s.date ? [[t("date"), fmt.format(new Date(s.date))] as [string, string]] : []),
    [t("problemCount"), s.problems.length],
    [t("partCount"), partCount],
    [t("totalPoints"), total],
  ];

  return (
    <>
      <PageHero
        crumbs={[...crumbs, { label: `${s.year} ${pick(s.round, locale)}` }]}
        eyebrow={`USAAIO ${s.year}`}
        title={pick(s.round, locale)}
        lead={pick(s.intro, locale)}
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {stats.map(([l, v]) => (
            <div key={l}>
              <dt className="text-sm text-slate-500">{l}</dt>
              <dd className="mt-0.5 text-lg font-semibold text-ink tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8">
          <SourceLinks pdf={s.pdf} official={s.officialUrl} />
        </div>
      </PageHero>

      <Section className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label={t("contents")} className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
          <p className="text-sm font-semibold text-slate-500">{t("contents")}</p>
          <ol className="mt-3 space-y-4 text-sm">
            {statements.problems.map((p) => (
              <li key={p.number}>
                <a href={`#problem-${p.number}`} className="block rounded-lg px-2 py-1 text-slate-700 hover:bg-slate-50 hover:text-brand-700">
                  <span className="font-mono text-xs text-slate-400">P{p.number}</span> {meta.get(p.number) ? pick(meta.get(p.number)!.title, locale) : ""}
                </a>
                {p.parts.length > 0 && (
                  <ol className="mt-1.5 flex flex-wrap gap-1 px-2">
                    {p.parts.map((x) => (
                      <li key={x.label}>
                        <a
                          href={`#${partId(p.number, x.label)}`}
                          className="grid h-7 min-w-7 place-items-center rounded-md border border-slate-200 px-1 text-xs text-slate-600 tabular-nums hover:border-brand-300 hover:text-brand-700"
                          title={t("partN", { label: x.label })}
                        >
                          {x.label.includes(".") ? x.label.split(".").slice(1).join(".") : x.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-14">
          {locale === "zh" && <EnglishNote />}
          {statements.instructions && (
            <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
              <h2 className="text-lg font-semibold">{t("instructions")}</h2>
              <Markdown source={statements.instructions} className="prose-resai mt-3" />
            </section>
          )}

          {statements.problems.map((p) => (
            <ProblemBlock key={p.number} problem={p} meta={meta.get(p.number)} locale={locale} hasSolutions={!!s.hasSolutions} />
          ))}

          {s.rationale && (
            <Link
              href={`/usaaio/problems/${s.rationale.slug}`}
              className="group flex items-start gap-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-6 hover:border-brand-200"
            >
              <Lightbulb className="mt-0.5 size-6 shrink-0 text-brand-700" aria-hidden />
              <span>
                <span className="block text-lg font-semibold text-ink">{t("rationaleShort")}</span>
                <span className="mt-1 block leading-7 text-slate-600">{t("rationaleTeaser")}</span>
              </span>
              <ArrowRight className="mt-1 ml-auto size-5 shrink-0 text-brand-700 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          )}
          <Attribution />
        </div>
      </Section>
    </>
  );
}

async function ProblemBlock({ problem, meta, locale, hasSolutions }: { problem: StatementProblem; meta?: Problem; locale: string; hasSolutions: boolean }) {
  const t = await getTranslations("problems");
  return (
    <article id={`problem-${problem.number}`} className="scroll-mt-24">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold">
            <span className="mr-2 font-mono text-base text-brand-700">{t("problemN", { n: problem.number })}</span>
            {meta && pick(meta.title, locale)}
          </h2>
          {meta && (
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 tabular-nums">
              {t("points", { count: meta.points })}
            </span>
          )}
        </div>
        {meta && (
          <>
            {meta.kind && <p className="mt-1 text-sm font-medium text-brand-700">{t(meta.kind === "open-ended" ? "openEnded" : "guided")}</p>}
            <p className="mt-3 leading-7 text-slate-600">
              <span className="mr-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">{t("summaryLabel")}</span>
              {pick(meta.summary, locale)}
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {pick(meta.topics, locale).map((x) => (
                <Tag key={x}>{x}</Tag>
              ))}
            </ul>
          </>
        )}
      </header>

      {problem.intro && <Markdown source={problem.intro} className="prose-resai mt-8" />}

      <div className="mt-8 space-y-6">
        {problem.parts.map((x) => (
          <div key={x.label} className="space-y-6">
            {x.section && (
              <div className="pt-4">
                <h3 className="text-xl font-semibold text-ink">{x.section.title}</h3>
                {x.section.body && <Markdown source={x.section.body} className="prose-resai mt-4" />}
              </div>
            )}
            <PartBlock n={problem.number} part={x} hasSolutions={hasSolutions} />
          </div>
        ))}
      </div>
    </article>
  );
}

async function PartBlock({ n, part, hasSolutions }: { n: number; part: StatementPart; hasSolutions: boolean }) {
  const t = await getTranslations("problems");
  const id = partId(n, part.label);
  const kind = part.kind === "coding" ? t("coding") : part.kind === "non-coding" ? t("nonCoding") : part.kind ? t("codingReasoning") : null;
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-200">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3">
        <h3 className="mr-1 font-semibold">
          <a href={`#${id}`} className="hover:text-brand-700">
            {t("partN", { label: part.label })}
          </a>
        </h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 tabular-nums">{t("points", { count: part.points })}</span>
        {kind && <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-800">{kind}</span>}
        {part.source && (
          <a href={part.source} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-700">
            {t("forumThread")} <ExternalLink className="size-3" aria-hidden />
          </a>
        )}
      </div>
      <Markdown source={part.body} className="prose-resai px-5 py-4" />
      {hasSolutions && part.answer && (
        <details className="group border-t border-slate-100">
          <summary className="cursor-pointer list-none px-5 py-3 text-sm font-semibold text-brand-700 marker:hidden hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{t("showSolution")}</span>
            <span className="hidden group-open:inline">{t("hideSolution")}</span>
          </summary>
          <div className="border-t border-brand-100 bg-brand-50/40 px-5 py-4">
            <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">{t("officialSolution")}</p>
            <Markdown source={part.answer} className="prose-resai mt-2" />
          </div>
        </details>
      )}
    </section>
  );
}

async function SourceLinks({ pdf, official }: { pdf?: string; official: string }) {
  const t = await getTranslations("problems");
  return (
    <div className="flex flex-wrap gap-3">
      {pdf && (
        <a href={pdf} download className={buttonClass({ size: "sm" })}>
          <Download className="size-4" aria-hidden /> {t("downloadPdf")}
        </a>
      )}
      <a href={official} target="_blank" rel="noopener noreferrer" className={buttonClass({ variant: "secondary", size: "sm" })}>
        {t("officialSource")} <ExternalLink className="size-4" aria-hidden />
      </a>
    </div>
  );
}

async function EnglishNote() {
  const t = await getTranslations("problems");
  return <p className="mb-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{t("englishOnly")}</p>;
}

async function Attribution() {
  const t = await getTranslations("problems");
  return (
    <p className="mt-10 border-t border-slate-100 pt-6 text-xs leading-5 text-slate-500">
      {t("attribution")}{" "}
      <a href={PAST_PROBLEMS_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">
        usaaio.org
      </a>
    </p>
  );
}
