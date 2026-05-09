import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getTemplate,
  type SiteSettings,
  type TemplateDefinition,
} from '@tarheel/templates';
import { renderTemplateUnsafe } from '@tarheel/templates/registry';
import { SpecBanner } from './spec-banner';
import { LinkPrefixer } from './link-prefixer';
import { SpecMarqueeTape, SpecStamp } from './brewery-decorations';

/**
 * Public, no-auth, no-DB spec-preview route. Renders any registered template
 * directly from its `defaultContent`, so prospects can see exactly what their
 * redesign would look like before signing. URL pattern:
 *
 *   /spec/<clientSlug>            → home
 *   /spec/<clientSlug>/<path...>  → that page (e.g. /spec/southern-peak/food)
 *
 * `clientSlug` maps to a registered template id via SPEC_CLIENTS. Add new spec
 * targets there — no schema or component changes required.
 */

interface SpecClient {
  templateId: string;
  brandName: string;
  cityState: string;
  ownerEmail?: string;
  /** CSS class applied to the wrapping <div> so per-client palette overrides
   *  in globals.css can re-skin Tailwind brand-* tokens. */
  themeClass?: string;
}

const SPEC_CLIENTS: Record<string, SpecClient> = {
  'southern-peak': {
    templateId: 'restaurant_v2',
    brandName: 'Southern Peak Brewery',
    cityState: 'Apex, NC',
    ownerEmail: 'info@southernpeakbrewery.com',
    themeClass: 'spec-southern-peak',
  },
};

const FALLBACK_SETTINGS: SiteSettings = {
  brand: {},
  contact: {},
  hours: {},
  social: {},
  seo: {},
};

export const dynamic = 'force-static';

interface RouteProps {
  params: Promise<{ clientSlug: string; path?: string[] }>;
}

function pageSlugFromPath(path?: string[]): string {
  if (!path || path.length === 0) return '/';
  return '/' + path.join('/');
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { clientSlug } = await params;
  const client = SPEC_CLIENTS[clientSlug];
  if (!client) return { robots: { index: false, follow: false } };
  return {
    title: `${client.brandName} — spec preview`,
    description: `A redesign concept for ${client.brandName} (${client.cityState}) by Tar Heel Web Co. Not affiliated.`,
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  // Pre-render the home of every spec client so the share URL is instant.
  return Object.keys(SPEC_CLIENTS).map((clientSlug) => ({ clientSlug, path: [] as string[] }));
}

export default async function SpecPreviewPage({ params }: RouteProps) {
  const { clientSlug, path } = await params;
  const client = SPEC_CLIENTS[clientSlug];
  if (!client) notFound();

  let template: TemplateDefinition;
  try {
    template = getTemplate(client.templateId);
  } catch {
    notFound();
  }

  const slug = pageSlugFromPath(path);
  const page = template.pages.find((p) => p.slug === slug);
  if (!page) notFound();

  const settings = template.defaultSettings ?? FALLBACK_SETTINGS;
  const rendered = renderTemplateUnsafe(template.id, slug, page.defaultContent, settings);
  const prefix = `/spec/${clientSlug}`;

  const showBreweryDecorations = client.themeClass === 'spec-southern-peak';

  return (
    <div className={client.themeClass ?? ''}>
      <SpecBanner brandName={client.brandName} cityState={client.cityState} />
      <LinkPrefixer prefix={prefix} />
      <div className="pt-10">
        {showBreweryDecorations ? <SpecMarqueeTape /> : null}
        {rendered}
        {showBreweryDecorations ? <SpecStamp /> : null}
      </div>
    </div>
  );
}
