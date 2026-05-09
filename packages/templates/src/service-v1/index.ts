import type { TemplateDefinition } from '../types';
import { homeContent, servicesPageContent, areasPageContent, aboutPageContent, contactPageContent } from './schema';
import { defaultHome, defaultServices, defaultAreas, defaultAbout, defaultContact } from './default-content';
import {
  homeEditorMeta,
  servicesEditorMeta,
  areasEditorMeta,
  aboutEditorMeta,
  contactEditorMeta,
  settingsEditorMeta,
} from './editor-meta';
import { ServiceHome } from './pages/home';
import { ServicePagesList } from './pages/services';
import { ServiceAreas } from './pages/areas';
import { ServiceAbout } from './pages/about';
import { ServiceContact } from './pages/contact';

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
