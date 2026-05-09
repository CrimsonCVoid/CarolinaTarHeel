import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { ContactPageContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { Hours } from '../../shared/hours';
import { MapEmbed } from '../../shared/map-embed';
import { ContactForm } from '../../shared/forms/contact-form';
import { FAQ } from '../../shared/faq/index';
import { JsonLd } from '../../shared/v2/jsonld';

const NAV_LINKS = [
  { label: 'Beer', href: '/beer' },
  { label: 'Food', href: '/food' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function RestaurantV2Contact({ content, settings }: PageRenderProps<ContactPageContent>) {
  const faq = content.faq ?? [];
  const contact = settings.contact;

  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <section className="border-b border-slate-200 bg-white">
          <Container className="py-16 md:py-20">
            <div className="mx-auto max-w-3xl">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                {content.hero?.headline ?? 'Contact'}
              </h1>
              {content.hero?.subheadline ? (
                <p className="mt-4 text-lg text-slate-700">{content.hero.subheadline}</p>
              ) : null}
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
            <aside className="space-y-8">
              {contact?.phone ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Phone</h2>
                  <a
                    className="mt-1 block text-2xl font-semibold text-brand-700 hover:underline"
                    href={`tel:${contact.phone}`}
                  >
                    {contact.phone}
                  </a>
                </div>
              ) : null}
              {contact?.email ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Email</h2>
                  <a
                    className="mt-1 block text-base text-slate-900 hover:underline"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>
                </div>
              ) : null}
              {contact?.address ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Address</h2>
                  <address className="mt-1 not-italic text-base text-slate-900">
                    {contact.address.line1}
                    {contact.address.line2 ? (
                      <>
                        <br />
                        {contact.address.line2}
                      </>
                    ) : null}
                    <br />
                    {contact.address.city}, {contact.address.state} {contact.address.postalCode}
                  </address>
                </div>
              ) : null}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hours</h2>
                <div className="mt-2">
                  <Hours hours={settings.hours} />
                </div>
              </div>
              {content.showLocations ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Locations</h2>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>
                      <a className="text-brand-700 hover:underline" href="/locations/sweetwater">
                        Sweetwater Taproom & Pizzeria →
                      </a>
                    </li>
                    <li>
                      <a className="text-brand-700 hover:underline" href="/locations/windy-road">
                        Original Brewery (Windy Road) →
                      </a>
                    </li>
                  </ul>
                </div>
              ) : null}
            </aside>

            <div className="space-y-10">
              {content.showMap && contact?.address ? <MapEmbed address={contact.address} /> : null}
              <ContactForm
                formId="contact"
                headline={content.formHeadline ?? 'Send us a note'}
              />
              {content.formSubheadline ? (
                <p className="text-sm text-slate-600">{content.formSubheadline}</p>
              ) : null}
            </div>
          </div>
        </Container>

        {faq.length > 0 ? <FAQ headline="Common questions" items={faq} /> : null}
      </main>
      <Footer settings={settings} />

      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
      />
    </>
  );
}
