import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section } from "@/components/ui/page";
import { UsaaioMap } from "@/components/usaaio/UsaaioMap";
import { placeLabel } from "@/content/place-names";
import { getMapData, getUsaaioStats, TIERS } from "@/lib/usaaio-data";
import { pageMetadata } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/usaaio/statistics">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stats" });
  const s = getUsaaioStats();
  return pageMetadata(locale, "/usaaio/statistics", t("metaTitle"), t("lead", { winners: s.winners, schools: s.schools }));
}

export default async function StatisticsPage({ params }: PageProps<"/[locale]/usaaio/statistics">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stats");
  const m = await getTranslations("map");
  const nav = await getTranslations("nav");
  const data = getMapData();
  const stats = getUsaaioStats();
  const rows = [...data.schools].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  const loc = locale === "zh" ? "zh" : "en";

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: nav("home") }, { href: "/usaaio", label: "USAAIO" }, { label: t("crumb") }]}
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead", { winners: stats.winners, schools: stats.schools })}
      />

      <Section className="pt-10 sm:pt-12">
        <UsaaioMap data={data} />

        <details className="group mt-10 rounded-2xl border border-slate-200">
          <summary className="cursor-pointer list-none px-6 py-4 font-semibold text-ink marker:hidden">
            <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
            {t("tableToggle", { count: rows.length })}
          </summary>
          <div className="overflow-x-auto border-t border-slate-200">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{t("tableCaption")}</caption>
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">{t("colSchool")}</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">{t("colLocation")}</th>
                  {TIERS.map((x) => (
                    <th key={x} scope="col" className="px-3 py-2.5 text-right font-medium">
                      {m(`tiers.${x}`)}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">{t("colTotal")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((s) => (
                  <tr key={s.name}>
                    <th scope="row" className="px-4 py-2 font-medium text-ink">{s.name}</th>
                    <td className="px-4 py-2 text-slate-500">{placeLabel(s, loc)}</td>
                    {TIERS.map((x) => (
                      <td key={x} className="px-3 py-2 text-right tabular-nums">{s.counts[x] || "–"}</td>
                    ))}
                    <td className="px-4 py-2 text-right font-semibold tabular-nums">{s.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="flex gap-4 rounded-2xl bg-slate-50 p-6">
            <ShieldCheck className="mt-0.5 size-6 shrink-0 text-emerald-600" aria-hidden />
            <div>
              <h2 className="font-semibold">{t("privacyTitle")}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{t("privacyBody")}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="font-semibold">{t("sourceTitle")}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{t("sourceBody")}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
