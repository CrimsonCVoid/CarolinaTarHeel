import type { z } from 'zod';
import type { TemplateDefinition, PageDefinition, SiteSettings } from './types';
import { restaurantV1 } from './restaurant-v1/index';
import { serviceV1 } from './service-v1/index';
import type { ReactElement } from 'react';
import { createElement } from 'react';

const registry: Record<string, TemplateDefinition> = {
  [restaurantV1.id]: restaurantV1,
  [serviceV1.id]: serviceV1,
};

export function getTemplate(id: string): TemplateDefinition {
  const t = registry[id];
  if (!t) throw new Error(`Unknown template id: ${id}`);
  return t;
}

export function listTemplates(): TemplateDefinition[] {
  return Object.values(registry);
}

export function getPage(templateId: string, slug: string): PageDefinition<z.ZodTypeAny> | undefined {
  const t = getTemplate(templateId);
  return t.pages.find((p) => p.slug === slug);
}

/**
 * Render a template page given content + settings. Used by apps/site
 * and the publish gate. Validates content against the page schema;
 * throws on mismatch — bad data never reaches a live site.
 */
export function renderTemplate(
  templateId: string,
  slug: string,
  content: unknown,
  settings: SiteSettings,
): ReactElement {
  const page = getPage(templateId, slug);
  if (!page) throw new Error(`Page ${slug} not found in template ${templateId}`);
  const parsed = page.schema.parse(content);
  return createElement(page.Component, { content: parsed, settings });
}

/**
 * Render without re-validating. Used only by the LIVE editor preview,
 * which receives mid-edit drafts that may temporarily fail validation
 * (e.g., a half-typed URL). Components themselves tolerate
 * partial/missing data — they read fields with optional chaining and
 * skip blocks that aren't filled. Never use for production rendering.
 */
export function renderTemplateUnsafe(
  templateId: string,
  slug: string,
  content: unknown,
  settings: SiteSettings,
): ReactElement {
  const page = getPage(templateId, slug);
  if (!page) throw new Error(`Page ${slug} not found in template ${templateId}`);
  return createElement(page.Component, { content: content as never, settings });
}

export { restaurantV1, serviceV1 };
