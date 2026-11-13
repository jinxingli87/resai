import Image from "next/image";
import { pageImages } from "@/content/usaaio-problems";

export function ProblemPages({ slug, pages, title, pageLabel }: { slug: string; pages: number; title: string; pageLabel: (n: number) => string }) {
  return (
    <ol className="space-y-6">
      {pageImages(slug, pages).map((src, i) => (
        <li key={src} id={`page-${i + 1}`} className="scroll-mt-24">
          <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <Image
              src={src}
              alt={`${title}: ${pageLabel(i + 1)}`}
              width={1400}
              height={1812}
              sizes="(min-width: 1024px) 760px, 100vw"
              className="h-auto w-full"
              priority={i === 0}
            />
            <figcaption className="border-t border-slate-100 px-4 py-2 text-right text-xs text-slate-500">{pageLabel(i + 1)}</figcaption>
          </figure>
        </li>
      ))}
    </ol>
  );
}
