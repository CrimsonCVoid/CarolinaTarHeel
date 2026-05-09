import type { TemplateDefinition } from '../types';
import { homeContent, menuPageContent, aboutPageContent, contactPageContent } from './schema';
import { defaultHome, defaultMenu, defaultAbout, defaultContact } from './default-content';
import {
  homeEditorMeta,
  menuEditorMeta,
  aboutEditorMeta,
  contactEditorMeta,
  settingsEditorMeta,
} from './editor-meta';
import { RestaurantHome } from './pages/home';
import { RestaurantMenu } from './pages/menu';
import { RestaurantAbout } from './pages/about';
import { RestaurantContact } from './pages/contact';

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
