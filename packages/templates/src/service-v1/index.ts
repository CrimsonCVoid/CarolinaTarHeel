import type { TemplateDefinition } from '../types.js';
import { homeContent, servicesPageContent, areasPageContent, aboutPageContent, contactPageContent } from './schema.js';
import { defaultHome, defaultServices, defaultAreas, defaultAbout, defaultContact } from './default-content.js';
import {
  homeEditorMeta,
  servicesEditorMeta,
  areasEditorMeta,
  aboutEditorMeta,
  contactEditorMeta,
  settingsEditorMeta,
} from './editor-meta.js';
import { ServiceHome } from './pages/home.js';
import { ServicePagesList } from './pages/services.js';
import { ServiceAreas } from './pages/areas.js';
import { ServiceAbout } from './pages/about.js';
import { ServiceContact } from './pages/contact.js';

export const serviceV1: TemplateDefinition = {
  id: 'service_v1',
  name: 'Home services — Triangle',
  description:
    'HVAC / plumbing / roofing template optimized for emergency calls. Heavy click-to-call, service-area landing pages, and a fast contact form.',
  pages: [
    { slug: '/', title: 'Home', schema: homeContent, defaultContent: defaultHome, editorMeta: homeEditorMeta, Component: ServiceHome },
    {
      slug: '/services',
      title: 'Services',
      schema: servicesPageContent,
      defaultContent: defaultServices,
      editorMeta: servicesEditorMeta,
      Component: ServicePagesList,
    },
    {
      slug: '/service-areas',
      title: 'Service areas',
      schema: areasPageContent,
      defaultContent: defaultAreas,
      editorMeta: areasEditorMeta,
      Component: ServiceAreas,
    },
    {
      slug: '/about',
      title: 'About',
      schema: aboutPageContent,
      defaultContent: defaultAbout,
      editorMeta: aboutEditorMeta,
      Component: ServiceAbout,
    },
    {
      slug: '/contact',
      title: 'Contact',
      schema: contactPageContent,
      defaultContent: defaultContact,
      editorMeta: contactEditorMeta,
      Component: ServiceContact,
    },
  ],
  settingsEditorMeta,
};
