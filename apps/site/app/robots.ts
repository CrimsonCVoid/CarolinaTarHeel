import type { MetadataRoute } from 'next';
import { fetchSite } from '@/lib/content';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await fetchSite();
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `https://${site.domain}/sitemap.xml`,
    host: site.domain,
  };
}
