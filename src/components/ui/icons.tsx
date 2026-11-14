import {
  Bot,
  Brain,
  Code2,
  Eye,
  Globe2,
  HeartHandshake,
  MessagesSquare,
  Rocket,
  Scale,
  Sigma,
  Sparkles,
  Stethoscope,
  Telescope,
  Users,
  Dna,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  code: Code2,
  sparkles: Sparkles,
  sigma: Sigma,
  brain: Brain,
  messages: MessagesSquare,
  eye: Eye,
  bot: Bot,
  telescope: Telescope,
  rocket: Rocket,
  stethoscope: Stethoscope,
  dna: Dna,
  globe: Globe2,
  users: Users,
  scale: Scale,
  heart: HeartHandshake,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Sparkles;
  return <C className={className} aria-hidden />;
}
