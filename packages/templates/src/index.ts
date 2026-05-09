export type {
  TemplateDefinition,
  PageDefinition,
  PageRenderProps,
  FieldKind,
  FieldMeta,
  FieldOption,
  SiteSettings,
} from './types';
export { getTemplate, listTemplates, getPage, renderTemplate } from './registry';
export { restaurantV1 } from './restaurant-v1/index';
export { serviceV1 } from './service-v1/index';
