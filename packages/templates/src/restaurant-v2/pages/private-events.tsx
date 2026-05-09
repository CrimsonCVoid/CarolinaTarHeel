import Image from 'next/image';
import { Container, Badge } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { PrivateEventsContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { HeroCentered } from '../../shared/hero/hero-centered';
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

export function RestaurantV2PrivateEvents({ content, settings }: PageRenderProps<PrivateEventsContent>) {
  const spaces = content.spaces ?? [];
  const faq = content.faq ?? [];

  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <HeroCentered
          headline={content.hero?.headline ?? 'Private events'}
          subheadline={content.hero?.subheadline}
          bgImage={content.hero?.backgroundImage}
        />

        {content.intro ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {content.intro.headline}
                </h2>
                <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">
                  {content.intro.body}
                </p>
              </div>
            </Container>
          </section>
        ) : null}

        {spaces.length > 0 ? (
          <section className="bg-slate-50">
            <Container className="py-16 md:py-20">
              <ul className="grid gap-8 md:grid-cols-2">
                {spaces.map((space, i) => (
                  <li key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    {space.image ? (
                      <div className="relative aspect-[16/10] bg-slate-100">
                        <Image
                          src={space.image}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="p-6">
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
                        {space.name}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span className="font-medium text-slate-900">{space.capacity}</span>
                        {space.priceFrom ? (
                          <>
                            <span aria-hidden>·</span>
                            <span>From {space.priceFrom}</span>
                          </>
                        ) : null}
                      </div>
                      {space.description ? (
                        <p className="mt-4 text-sm leading-relaxed text-slate-700">{space.description}</p>
                      ) : null}
                      {space.features.length > 0 ? (
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {space.features.map((f) => (
                            <li key={f}>
                              <Badge variant="muted">{f}</Badge>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        <section className="bg-white">
          <Container className="py-16 md:py-20">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {content.inquiry?.headline ?? 'Plan your event'}
                </h2>
                {content.inquiry?.subheadline ? (
                  <p className="mt-4 text-base leading-relaxed text-slate-700">{content.inquiry.subheadline}</p>
                ) : null}
                <dl className="mt-8 space-y-4 text-sm">
                  {content.inquiry?.email ? (
                    <div>
                      <dt className="font-semibold uppercase tracking-wide text-slate-500">Email</dt>
                      <dd className="mt-1">
                        <a className="text-brand-700 hover:underline" href={`mailto:${content.inquiry.email}`}>
                          {content.inquiry.email}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                  {content.inquiry?.phone ? (
                    <div>
                      <dt className="font-semibold uppercase tracking-wide text-slate-500">Phone</dt>
                      <dd className="mt-1">
                        <a className="text-brand-700 hover:underline" href={`tel:${content.inquiry.phone}`}>
                          {content.inquiry.phone}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
              <div>
                <ContactForm formId="private-events" headline="Tell us about your event" />
              </div>
            </div>
          </Container>
        </section>

        {faq.length > 0 ? <FAQ headline="Common questions" items={faq} /> : null}
      </main>
      <Footer settings={settings} />

      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Private Events', url: '/private-events' },
        ]}
      />
    </>
  );
}
