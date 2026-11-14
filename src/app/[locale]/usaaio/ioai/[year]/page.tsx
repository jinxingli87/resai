import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, FolderGit2, MapPin, Timer } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Markdown } from "@/components/content/Markdown";
import { PageHero, Section, Tag } from "@/components/ui/page";
import { getIoaiYear, ioaiYears, type IoaiTask } from "@/content/ioai";
import { pageMetadata, pick } from "@/lib/i18n";

export function generateStaticParams() {
  return ioaiYears.map((y) => ({ year: String(y.year) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/usaaio/ioai/[year]">): Promise<Metadata> {
  const { locale, year } = await params;
  const y = getIoaiYear(year);
  if (!y) return {};
  return pageMetadata(locale, `/usaaio/ioai/${year}`, `IOAI ${y.year} · ${pick(y.host, locale)}`, pick(y.facts, locale));
}

function readStatement(year: number, task: IoaiTask, locale: string) {
  if (!task.hasStatement) return null;
  const dir = path.join(process.cwd(), "src/content/ioai", String(year));
  const file = path.join(dir, `${task.slug}.${locale === "zh" ? "zh" : "en"}.md`);
  const fallback = path.join(dir, `${task.slug}.en.md`);
  const src = fs.existsSync(file) ? file : fs.existsSync(fallback) ? fallback : null;
  if (!src) return null;
  // The page already shows the task title, so drop the statement's own top-level heading.
  return fs.readFileSync(src, "utf8").replace(/^\s*#\s+[^\n]*\n/, "");
}

export default async function IoaiYearPage({ params }: PageProps<"/[locale]/usaaio/ioai/[year]">) {
  const { locale, year } = await params;
  setRequestLocale(locale);
  const y = getIoaiYear(year);
  if (!y) notFound();
  const t = await getTranslations("ioai");
  const nav = await getTranslations("nav");

  const tasks = y.tasks.map((task) => ({ task, md: y.showStatements ? readStatement(y.year, task, locale) : null }));
  const days = y.tasks.some((x) => x.day) ? ([1, 2] as const) : null;

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: nav("home") }, { href: "/usaaio", label: "USAAIO" }, { href: "/usaaio/ioai", label: "IOAI" }, { label: String(y.year) }]}
        eyebrow={pick(y.edition, locale)}
        title={`IOAI ${y.year}`}
        lead={pick(y.facts, locale)}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 text-brand-700" aria-hidden /> {pick(y.host, locale)} · {pick(y.dates, locale)}
          </span>
          <a href={y.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-brand-700 hover:underline">
            <FolderGit2 className="size-4" aria-hidden /> {t("officialRepo")}
          </a>
        </div>
      </PageHero>

      <Section className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label={t("tasks")} className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold text-slate-500">{t("tasks")}</p>
          <ol className="mt-3 space-y-1 text-sm">
            {y.tasks.map((task, i) => (
              <li key={task.slug}>
                <a href={`#${task.slug}`} className="flex gap-2 rounded-lg px-2 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-brand-700">
                  <span className="font-mono text-xs text-slate-400">{i + 1}</span>
                  {pick(task.title, locale)}
                </a>
              </li>
            ))}
          </ol>
          {locale === "zh" && y.showStatements && <p className="mt-6 text-xs leading-5 text-slate-500">{t("zhSource")}</p>}
        </nav>

        <div className="min-w-0 space-y-16">
          {(days ?? [null]).map((d) => (
            <div key={d ?? "all"} className="space-y-10">
              {d && <h2 className="text-sm font-semibold tracking-wide text-brand-700 uppercase">{t("day", { n: d })}</h2>}
              {tasks
                .filter(({ task }) => !d || task.day === d)
                .map(({ task, md }) => (
                  <article key={task.slug} id={task.slug} className="scroll-mt-24 rounded-2xl border border-slate-200">
                    <header className="border-b border-slate-100 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <h3 className="text-2xl font-semibold">{pick(task.title, locale)}</h3>
                        <a href={task.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
                          {t("officialTask")} <ExternalLink className="size-3.5" aria-hidden />
                        </a>
                      </div>
                      <p className="mt-3 leading-7 text-slate-600">{pick(task.summary, locale)}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {task.timeLimit && (
                          <Tag className="bg-brand-50 text-brand-800">
                            <Timer className="mr-1 size-3" aria-hidden />
                            {task.timeLimit}
                          </Tag>
                        )}
                        {pick(task.topics, locale).map((x) => (
                          <Tag key={x}>{x}</Tag>
                        ))}
                      </div>
                    </header>
                    {md ? (
                      <details className="group">
                        <summary className="cursor-pointer list-none px-6 py-4 text-sm font-semibold text-brand-700 marker:hidden hover:bg-slate-50">
                          <span className="group-open:hidden">{t("showStatement")}</span>
                          <span className="hidden group-open:inline">{t("hideStatement")}</span>
                        </summary>
                        <div className="border-t border-slate-100 p-6">
                          <Markdown source={md} />
                        </div>
                      </details>
                    ) : null}
                  </article>
                ))}
            </div>
          ))}

          <p className="rounded-2xl bg-slate-50 p-6 text-sm leading-6 text-slate-600">
            {t("attribution", { year: y.year })}{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">
              {y.license}
            </a>
            . {t("source")}{" "}
            <a href={y.repo} target="_blank" rel="noopener noreferrer" className="font-medium break-all text-brand-700 hover:underline">
              {y.repo.replace("https://", "")}
            </a>
            . {y.showStatements ? t("adapted") : t("summariesOnly")}
          </p>
        </div>
      </Section>
    </>
  );
}
