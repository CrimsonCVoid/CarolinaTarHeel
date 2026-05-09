import type { z } from 'zod';
import type { ComponentType } from 'react';
import type { Address, WeeklyHours, Brand, Contact, Social, SeoDefaults } from '@tarheel/db';

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'url'
  | 'email'
  | 'phone'
  | 'number'
  | 'boolean'
  | 'select'
  | 'image'
  | 'color'
  | 'array'
  | 'address'
  | 'hours'
  | 'object';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldMeta {
  label: string;
  help?: string;
  kind: FieldKind;
  placeholder?: string;
  options?: FieldOption[];
  /**
   * For `kind: 'array'`. The name of a field on each item that should be shown as
   * the row label in the editor (e.g. `'name'` for menu items). Must be a static
   * string — not a function — because editorMeta is serialized across the
   * RSC → Client Component boundary in the editor shell.
   */
  itemLabel?: string;
  fields?: Record<string, FieldMeta>;
  maxLength?: number;
  required?: boolean;
}

export interface SiteSettings {
  brand: Brand;
  contact: Contact;
  hours: WeeklyHours;
  social: Social;
  seo: SeoDefaults;
}

export interface PageRenderProps<TContent> {
  content: TContent;
  settings: SiteSettings;
}

export interface PageDefinition<TSchema extends z.ZodTypeAny> {
  slug: string;
  title: string;
  schema: TSchema;
  defaultContent: z.infer<TSchema>;
  editorMeta: Record<string, FieldMeta>;
  Component: ComponentType<PageRenderProps<z.infer<TSchema>>>;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  pages: PageDefinition<z.ZodTypeAny>[];
  settingsEditorMeta: Record<string, FieldMeta>;
}

export type { Address, WeeklyHours, Brand, Contact, Social, SeoDefaults };
