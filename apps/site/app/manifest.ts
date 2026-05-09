import type { MetadataRoute } from 'next';
import { fetchSiteSettings } from '@/lib/content';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await fetchSiteSettings();
  return {
    name: settings.brand.name ?? 'Site',
    short_name: settings.brand.name ?? 'Site',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: settings.brand.primary ?? '#33658c',
    icons: [],
  };
}
