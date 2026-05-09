import type { TemplateDefinition } from '../types';
import {
  homeContent,
  locationDetailContent,
  beerPageContent,
  foodPageContent,
  eventsPageContent,
  aboutPageContent,
  privateEventsContent,
  careersPageContent,
  contactPageContent,
} from './schema';
import {
  defaultHome,
  defaultSweetwater,
  defaultWindyRoad,
  defaultBeer,
  defaultFood,
  defaultEvents,
  defaultAbout,
  defaultPrivateEvents,
  defaultCareers,
  defaultContact,
  defaultSettings,
} from './default-content';
import {
  homeEditorMeta,
  locationDetailEditorMeta,
  beerEditorMeta,
  foodEditorMeta,
  eventsEditorMeta,
  aboutEditorMeta,
  privateEventsEditorMeta,
  careersEditorMeta,
  contactEditorMeta,
  settingsEditorMeta,
} from './editor-meta';
import { RestaurantV2Home } from './pages/home';
import { RestaurantV2LocationDetail } from './pages/location-detail';
import { RestaurantV2Beer } from './pages/beer';
import { RestaurantV2Food } from './pages/food';
import { RestaurantV2Events } from './pages/events';
import { RestaurantV2About } from './pages/about';
import { RestaurantV2PrivateEvents } from './pages/private-events';
import { RestaurantV2Careers } from './pages/careers';
import { RestaurantV2Contact } from './pages/contact';

export const restaurantV2: TemplateDefinition = {
  id: 'restaurant_v2',
  name: 'Restaurant — Brewery & Multi-Location',
  description:
    'Multi-location brewery / restaurant group with tap list, food menu, events & food trucks, locations, private events, and careers. Built for breweries with two or more taprooms or a brewery + pizzeria pairing.',
  pages: [
    {
      slug: '/',
      title: 'Home',
      schema: homeContent,
      defaultContent: defaultHome,
      editorMeta: homeEditorMeta,
      Component: RestaurantV2Home,
    },
    {
      slug: '/locations/sweetwater',
      title: 'Sweetwater Taproom & Pizzeria',
      schema: locationDetailContent,
      defaultContent: defaultSweetwater,
      editorMeta: locationDetailEditorMeta,
      Component: RestaurantV2LocationDetail,
    },
    {
      slug: '/locations/windy-road',
      title: 'Windy Road Brewery',
      schema: locationDetailContent,
      defaultContent: defaultWindyRoad,
      editorMeta: locationDetailEditorMeta,
      Component: RestaurantV2LocationDetail,
    },
    {
      slug: '/beer',
      title: 'Our Beer',
      schema: beerPageContent,
      defaultContent: defaultBeer,
      editorMeta: beerEditorMeta,
      Component: RestaurantV2Beer,
    },
    {
      slug: '/food',
      title: 'Pizza Menu',
      schema: foodPageContent,
      defaultContent: defaultFood,
      editorMeta: foodEditorMeta,
      Component: RestaurantV2Food,
    },
    {
      slug: '/events',
      title: 'Events & Food Trucks',
      schema: eventsPageContent,
      defaultContent: defaultEvents,
      editorMeta: eventsEditorMeta,
      Component: RestaurantV2Events,
    },
    {
      slug: '/about',
      title: 'About Us',
      schema: aboutPageContent,
      defaultContent: defaultAbout,
      editorMeta: aboutEditorMeta,
      Component: RestaurantV2About,
    },
    {
      slug: '/private-events',
      title: 'Private Events',
      schema: privateEventsContent,
      defaultContent: defaultPrivateEvents,
      editorMeta: privateEventsEditorMeta,
      Component: RestaurantV2PrivateEvents,
    },
    {
      slug: '/careers',
      title: 'Careers',
      schema: careersPageContent,
      defaultContent: defaultCareers,
      editorMeta: careersEditorMeta,
      Component: RestaurantV2Careers,
    },
    {
      slug: '/contact',
      title: 'Contact',
      schema: contactPageContent,
      defaultContent: defaultContact,
      editorMeta: contactEditorMeta,
      Component: RestaurantV2Contact,
    },
  ],
  settingsEditorMeta,
  defaultSettings,
};
