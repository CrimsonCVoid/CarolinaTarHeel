import type { MetadataRoute } from 'next';
import { fetchSite, fetchAllPublishedSlugs } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, slugs] = await Promise.all([fetchSite(), fetchAllPublishedSlugs()]);
  return slugs.map((s) => ({
    url: `https://${site.domain}${s === '/' ? '' : s}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: s === '/' ? 1 : 0.7,
  }));
}
