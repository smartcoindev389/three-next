import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config, { isServer }) => {
    // Handle glslify dynamic imports
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    // Suppress critical dependency warnings for glslify
    config.ignoreWarnings = [
      { module: /node_modules\/glslify/ },
      { module: /node_modules\/glslify-deps/ },
    ];

    return config;
  },
  sassOptions: {
    additionalData: `
      @use "./src/styles/variables.scss" as *;
      @use "./src/styles/mixins.scss" as *;
      @use "./src/styles/typography.scss" as *;
    `,
    quietDeps: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi.platformz.com',
      },
      {
        protocol: 'https',
        hostname: 'devstrapi.platformz.com',
      },
      {
        protocol: 'https',
        hostname: 'devstrapi.platformz.us',
      },
      {
        protocol: 'https',
        hostname: 'strapi.platformz.us',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
