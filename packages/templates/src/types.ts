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
  itemLabel?: (item: unknown) => string;
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
