import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/courses", destination: "/education", permanent: true },
      { source: "/consulting", destination: "/", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
