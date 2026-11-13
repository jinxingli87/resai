import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EmailLink } from "@/components/contact/ContactBits";
import { WeChatQr } from "@/components/contact/WeChatQr";
import { programs } from "@/content/programs";
import { pick } from "@/lib/i18n";
import { WECHAT_ID } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  const groups = [
    {
      title: t("programs"),
      links: programs.map((p) => ({ href: `/education/${p.slug}`, label: pick(p.shortTitle, locale) })),
    },
    {
      title: t("olympiad"),
      links: [
        { href: "/usaaio", label: t("usaaioOverview") },
        { href: "/usaaio/problems", label: t("problems") },
        { href: "/usaaio/statistics", label: t("statistics") },
        { href: "/usaaio/ioai", label: t("ioai") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/research", label: nav("research") },
        { href: "/about", label: nav("about") },
        { href: "/forum", label: nav("forum") },
        { href: "/contact", label: nav("contact") },
      ],
    },
  ];

  return (
    <footer className="mt-24 bg-ink text-slate-300">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <div className="inline-flex rounded-xl bg-white px-3 py-2">
            <Image src="/brand/logo.svg" alt="ResAI" width={828} height={346} className="h-8 w-auto" />
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">{t("tagline")}</p>
          <div className="mt-6 flex items-start gap-5">
            <WeChatQr size={96} caption={false} className="shrink-0" />
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">{t("email")}</dt>
                <dd>
                  <EmailLink className="text-white hover:text-brand-300" />
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{t("wechat")}</dt>
                <dd className="text-white">{WECHAT_ID}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="text-sm font-semibold text-white">{g.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-slate-400 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} ResAI. {t("rights")}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
