import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gzip/Brotli compression for all responses
  compress: true,

  images: {
    remotePatterns: [
      {
        // Supabase Storage CDN — covers all project subdomains
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Cache optimised images for 1 year — Supabase CDN URLs are immutable
    minimumCacheTTL: 31536000,
    // Allow modern formats for better compression
    formats: ['image/avif', 'image/webp'],
  },

  /**
   * Add CDN-friendly Cache-Control headers to public locale pages.
   * s-maxage=86400  → Vercel Edge caches for 24h (matches ISR revalidate)
   * stale-while-revalidate=604800 → serve stale while revalidating in background (7d window)
   */
  async headers() {
    return [
      {
        source: '/:locale(en|ar)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        // Static assets — immutable, cache 1 year
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
