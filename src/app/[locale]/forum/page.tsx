import type { Metadata } from "next";
import { MessagesSquare } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page";
import { pageMetadata } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/forum">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "forum" });
  return { ...pageMetadata(locale, "/forum", t("metaTitle"), t("lead")), robots: { index: false } };
}

export default async function ForumPage({ params }: PageProps<"/[locale]/forum">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("forum");
  const nav = await getTranslations("nav");

  return (
    <PageHero crumbs={[{ href: "/", label: nav("home") }, { label: nav("forum") }]} eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} className="min-h-[60vh]">
      <div className="flex flex-wrap items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-800">
          <MessagesSquare className="size-4" aria-hidden /> {t("badge")}
        </span>
        <Link href="/contact" className={buttonClass({ variant: "secondary" })}>
          {t("cta")}
        </Link>
      </div>
    </PageHero>
  );
}
