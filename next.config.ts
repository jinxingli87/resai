import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/courses", destination: "/education", permanent: true },
      { source: "/consulting", destination: "/", permanent: true },
      { source: "/checkout/:path*", destination: "/contact", permanent: false },
      { source: "/dashboard/:path*", destination: "/", permanent: false },
      { source: "/auth/:path*", destination: "/", permanent: false },
      { source: "/admin/:path*", destination: "/", permanent: false },
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
