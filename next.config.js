/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   const isDevelopment = process.env.NODE_ENV === "development";

  //   return [
  //     {
  //       source: "/api/base/:path*",
  //       destination: isDevelopment
  //         ? `${process.env.NEXT_PUBLIC_BASE_URL_DEVELOPMENT}/:path*`
  //         : `${process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION}/:path*`,
  //     },
  //     {
  //       source: "/api/secret/:path*",
  //       destination: isDevelopment
  //         ? `${process.env.NEXT_PUBLIC_SECRET_API_URL_DEVELOPMENT}/:path*`
  //         : `${process.env.NEXT_PUBLIC_SECRET_API_URL_PRODUCTION}/:path*`,
  //     },
  //   ];
  // },

  reactStrictMode: true,
  swcMinify: true,
  // reactStrictMode: true,
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  images: {
    domains: ["ordrz.me"], 
  },
};

export default nextConfig;
