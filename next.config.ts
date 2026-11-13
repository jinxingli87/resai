import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/courses", destination: "/education", permanent: true },
      { source: "/consulting", destination: "/", permanent: true },
      ...[
        ["python", "coding"],
        ["vibe-coding", "coding"],
        ["agentic-ai", "ai-agents"],
      ].flatMap(([from, to]) => [
        { source: `/education/${from}`, destination: `/education/${to}`, permanent: true },
        { source: `/zh/education/${from}`, destination: `/zh/education/${to}`, permanent: true },
      ]),
    ];
  },
};

export default withNextIntl(nextConfig);
