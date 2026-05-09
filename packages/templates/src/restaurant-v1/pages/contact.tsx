import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { ContactPageContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { ContactForm } from '../../shared/forms/contact-form';
import { Hours } from '../../shared/hours';
import { MapEmbed } from '../../shared/map-embed';
import { FAQ } from '../../shared/faq/index';

const NAV_LINKS = [
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function RestaurantContact({ content, settings }: PageRenderProps<ContactPageContent>) {
  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <section className="border-b border-slate-200 bg-white">
          <Container className="py-16 md:py-20">
            <div className="mx-auto max-w-3xl">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                {content.hero.headline}
              </h1>
              {content.hero.subheadline ? (
                <p className="mt-4 text-lg text-slate-700">{content.hero.subheadline}</p>
              ) : null}
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
            <aside className="space-y-8">
              {settings.contact.phone ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Phone</h2>
                  <a
                    className="mt-1 block text-2xl font-semibold text-brand-700 hover:underline"
                    href={`tel:${settings.contact.phone}`}
                  >
                    {settings.contact.phone}
                  </a>
                </div>
              ) : null}
              {settings.contact.email ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Email</h2>
                  <a className="mt-1 block text-base text-slate-900 hover:underline" href={`mailto:${settings.contact.email}`}>
                    {settings.contact.email}
                  </a>
                </div>
              ) : null}
              {settings.contact.address ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Address</h2>
                  <address className="mt-1 not-italic text-base text-slate-900">
                    {settings.contact.address.line1}
                    <br />
                    {settings.contact.address.city}, {settings.contact.address.state} {settings.contact.address.postalCode}
                  </address>
                </div>
              ) : null}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hours</h2>
                <div className="mt-2">
                  <Hours hours={settings.hours} />
                </div>
              </div>
            </aside>

            <div className="space-y-10">
              {content.showMap && settings.contact.address ? <MapEmbed address={settings.contact.address} /> : null}
              <ContactForm formId="contact" headline={content.formHeadline} />
            </div>
          </div>
        </Container>

        {content.faq && content.faq.length > 0 ? <FAQ headline="Common questions" items={content.faq} /> : null}
      </main>
      <Footer settings={settings} />
    </>
  );
}
