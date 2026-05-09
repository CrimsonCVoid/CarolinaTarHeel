import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { renderTemplate } from '@tarheel/templates';
import { fetchPublishedPage, fetchSiteSettings, fetchSite, fetchAllPublishedSlugs } from '@/lib/content';
import { generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = false;

interface RouteProps {
  params: Promise<{ slug?: string[] }>;
}

function pathFromSlug(slug?: string[]): string {
  if (!slug || slug.length === 0) return '/';
  return '/' + slug.join('/');
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  const [page, settings] = await Promise.all([fetchPublishedPage(path), fetchSiteSettings()]);
  if (!page) return {};
  return generatePageMetadata(page, settings);
}

export async function generateStaticParams() {
  const slugs = await fetchAllPublishedSlugs();
  return slugs.map((s) => ({ slug: s === '/' ? [] : s.replace(/^\//, '').split('/') }));
}

export default async function CatchAllPage({ params }: RouteProps) {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  const { isEnabled: isPreview } = await draftMode();

  const [site, page, settings] = await Promise.all([
    fetchSite(),
    fetchPublishedPage(path, { preview: isPreview }),
    fetchSiteSettings(),
  ]);

  if (!page) notFound();

  return renderTemplate(site.template_id, page.slug, page.content, settings);
}
