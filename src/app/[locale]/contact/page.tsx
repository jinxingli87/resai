import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section } from "@/components/ui/page";
import { CopyButton, EmailLink } from "@/components/contact/ContactBits";
import { WeChatQr } from "@/components/contact/WeChatQr";
import { pageMetadata } from "@/lib/i18n";
import { WECHAT_ID } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata(locale, "/contact", t("metaTitle"), t("lead"));
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const nav = await getTranslations("nav");

  return (
    <>
      <PageHero crumbs={[{ href: "/", label: nav("home") }, { label: nav("contact") }]} eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <Section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_auto]">
        <div className="rounded-2xl border border-slate-200 p-7">
          <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
            <Mail className="size-5" aria-hidden />
          </span>
          <h2 className="mt-5 text-lg font-semibold">{t("emailTitle")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("emailBody")}</p>
          <p className="mt-4 text-lg font-medium break-all text-ink">
            <EmailLink className="hover:text-brand-700" />
          </p>
          <CopyButton value="email" label={t("copyEmail")} className="mt-4" />
        </div>

        <div className="rounded-2xl border border-slate-200 p-7">
          <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
            <MessageCircle className="size-5" aria-hidden />
          </span>
          <h2 className="mt-5 text-lg font-semibold">{t("wechatTitle")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("wechatBody")}</p>
          <p className="mt-4 font-mono text-lg font-medium text-ink">{WECHAT_ID}</p>
          <CopyButton value={WECHAT_ID} label={t("copyWechat")} className="mt-4" />
        </div>

        <div className="flex flex-col items-center rounded-2xl border border-slate-200 p-7">
          <WeChatQr size={180} />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="rounded-2xl bg-slate-50 p-7">
          <h2 className="text-lg font-semibold">{t("topicsTitle")}</h2>
          <ul className="mt-4 grid gap-2 text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
            {(["programs", "usaaio", "research", "other"] as const).map((k) => (
              <li key={k} className="flex gap-2">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                {t(`topics.${k}`)}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
