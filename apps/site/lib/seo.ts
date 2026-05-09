import type { Metadata } from 'next';
import type { SiteSettings } from '@tarheel/templates';

interface PageSeoSource {
  title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
}

export function generatePageMetadata(page: PageSeoSource, settings: SiteSettings): Metadata {
  const brand = settings.brand.name ?? 'Site';
  const title = page.title ?? brand;
  const description = page.meta_description ?? undefined;
  const ogImage = page.og_image_url ?? settings.seo.defaultOgImage;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: brand,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      site: settings.seo.twitterHandle,
    },
  };
}
