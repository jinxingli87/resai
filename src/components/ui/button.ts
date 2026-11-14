import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-700 text-white shadow-sm hover:bg-brand-800",
        secondary: "border border-slate-300 bg-white text-ink hover:border-slate-400 hover:bg-slate-50",
        ghost: "text-brand-700 hover:bg-brand-50",
        dark: "bg-ink text-white hover:bg-slate-800",
        light: "bg-white text-ink hover:bg-brand-50",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[15px]",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function buttonClass({ className, ...props }: VariantProps<typeof button> & { className?: string } = {}) {
  return cn(button(props), className);
}
