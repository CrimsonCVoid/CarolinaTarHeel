/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  transpilePackages: ['@tarheel/templates'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  webpack(config, { isServer, dev }) {
    if (!isServer && !dev) {
      // Webpack measures raw uncompressed bytes; the spec target is <150 KB gzipped.
      // React 19 + Next 15 framework alone is ~150 KB raw, so a tight raw cap will
      // always fail. The real perf gate is Lighthouse CI in
      // .github/workflows/lighthouse.yml — it measures real gzipped bundle on a
      // Moto G4 + 4G profile and blocks merge below Performance >= 95.
      config.performance = {
        maxAssetSize: 600_000,
        maxEntrypointSize: 600_000,
        hints: 'warning',
      };
    }
    return config;
  },
};

export default nextConfig;
