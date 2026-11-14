import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-gradient-brand text-7xl font-semibold tracking-tight">404</p>
      <h1 className="mt-4 text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-3 max-w-md text-slate-600">{t("body")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClass()}>
          {t("home")}
        </Link>
        <Link href="/contact" className={buttonClass({ variant: "secondary" })}>
          {t("contact")}
        </Link>
      </div>
    </section>
  );
}
