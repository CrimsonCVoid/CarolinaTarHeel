import type { TemplateDefinition, PageDefinition, SiteSettings } from './types.js';
import { restaurantV1 } from './restaurant-v1/index.js';
import { serviceV1 } from './service-v1/index.js';
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

export function getPage(templateId: string, slug: string): PageDefinition<never> | undefined {
  const t = getTemplate(templateId);
  return t.pages.find((p) => p.slug === slug) as PageDefinition<never> | undefined;
}

/**
 * Render a template page given content + settings. Used by apps/site.
 * Validates content against the page schema; throws on mismatch.
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

export { restaurantV1, serviceV1 };
