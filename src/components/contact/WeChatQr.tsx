import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { WECHAT_ID } from "@/lib/utils";
import { cn } from "@/lib/utils";

export async function WeChatQr({ size = 220, className, caption = true }: { size?: number; className?: string; caption?: boolean }) {
  const t = await getTranslations("contact");
  return (
    <figure className={cn("inline-flex flex-col items-center", className)}>
      <a href="/contact/wechat-qr.jpg" target="_blank" rel="noopener" className="block rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <Image
          src="/contact/wechat-qr.jpg"
          alt={t("qrAlt", { id: WECHAT_ID })}
          width={size}
          height={size}
          style={{ width: size, height: size }}
        />
      </a>
      {caption && <figcaption className="mt-3 text-sm text-slate-500">{t("scanWechat")}</figcaption>}
    </figure>
  );
}
