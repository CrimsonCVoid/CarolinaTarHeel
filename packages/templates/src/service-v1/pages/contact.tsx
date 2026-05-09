import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types.js';
import type { ContactPageContent } from '../schema.js';
import { Nav } from '../../shared/nav.js';
import { Footer } from '../../shared/footer.js';
import { ContactForm } from '../../shared/forms/contact-form.js';
import { Hours } from '../../shared/hours.js';
import { FAQ } from '../../shared/faq/index.js';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Areas', href: '/service-areas' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const SERVICE_FORM_FIELDS = [
  { name: 'name', label: 'Name', kind: 'text' as const, required: true },
  { name: 'phone', label: 'Phone', kind: 'tel' as const, required: true },
  { name: 'email', label: 'Email', kind: 'email' as const },
  { name: 'service', label: 'What do you need?', kind: 'text' as const, required: true },
  { name: 'message', label: 'Anything else?', kind: 'textarea' as const },
];

export function ServiceContact({ content, settings }: PageRenderProps<ContactPageContent>) {
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
              {settings.contact.phone ? (
                <a
                  href={`tel:${settings.contact.phone}`}
                  className="mt-8 inline-flex h-14 items-center rounded-2xl bg-brand-600 px-8 text-lg font-semibold text-white hover:bg-brand-700"
                >
                  Call now: {settings.contact.phone}
                </a>
              ) : null}
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
            <aside className="space-y-8">
              {settings.contact.email ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Email</h2>
                  <a className="mt-1 block text-base text-slate-900 hover:underline" href={`mailto:${settings.contact.email}`}>
                    {settings.contact.email}
                  </a>
                </div>
              ) : null}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Office hours</h2>
                <div className="mt-2">
                  <Hours hours={settings.hours} />
                </div>
              </div>
            </aside>

            <ContactForm formId="service-request" headline={content.formHeadline} fields={SERVICE_FORM_FIELDS} />
          </div>
        </Container>

        {content.faq && content.faq.length > 0 ? <FAQ headline="Common questions" items={content.faq} /> : null}
      </main>
      <Footer settings={settings} />
    </>
  );
}
