import type { TemplateDefinition } from '../types.js';
import { homeContent, menuPageContent, aboutPageContent, contactPageContent } from './schema.js';
import { defaultHome, defaultMenu, defaultAbout, defaultContact } from './default-content.js';
import {
  homeEditorMeta,
  menuEditorMeta,
  aboutEditorMeta,
  contactEditorMeta,
  settingsEditorMeta,
} from './editor-meta.js';
import { RestaurantHome } from './pages/home.js';
import { RestaurantMenu } from './pages/menu.js';
import { RestaurantAbout } from './pages/about.js';
import { RestaurantContact } from './pages/contact.js';

export const restaurantV1: TemplateDefinition = {
  id: 'restaurant_v1',
  name: 'Restaurant — Classic',
  description: 'Family restaurant with home, menu, about, and contact pages. Hours, map, and contact form built in.',
  pages: [
    {
      slug: '/',
      title: 'Home',
      schema: homeContent,
      defaultContent: defaultHome,
      editorMeta: homeEditorMeta,
      Component: RestaurantHome,
    },
    {
      slug: '/menu',
      title: 'Menu',
      schema: menuPageContent,
      defaultContent: defaultMenu,
      editorMeta: menuEditorMeta,
      Component: RestaurantMenu,
    },
    {
      slug: '/about',
      title: 'About',
      schema: aboutPageContent,
      defaultContent: defaultAbout,
      editorMeta: aboutEditorMeta,
      Component: RestaurantAbout,
    },
    {
      slug: '/contact',
      title: 'Contact',
      schema: contactPageContent,
      defaultContent: defaultContact,
      editorMeta: contactEditorMeta,
      Component: RestaurantContact,
    },
  ],
  settingsEditorMeta,
};
