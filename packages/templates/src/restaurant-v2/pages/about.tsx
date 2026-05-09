import Image from 'next/image';
import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { AboutPageContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { HeroCentered } from '../../shared/hero/hero-centered';
import { CTA } from '../../shared/cta/index';
import { JsonLd } from '../../shared/v2/jsonld';

const NAV_LINKS = [
  { label: 'Beer', href: '/beer' },
  { label: 'Food', href: '/food' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function RestaurantV2About({ content, settings }: PageRenderProps<AboutPageContent>) {
  const team = content.team ?? [];
  const pillars = content.pillars ?? [];

  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <HeroCentered
          eyebrow={content.hero?.eyebrow}
          headline={content.hero?.headline ?? 'About'}
          subheadline={content.hero?.subheadline}
          bgImage={content.hero?.backgroundImage}
        />

        <section className="bg-white">
          <Container className="py-16 md:py-20">
            <div className="grid items-start gap-12 md:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {content.story?.headline}
                </h2>
                <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">
                  {content.story?.body}
                </p>
              </div>
              {content.story?.image ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={content.story.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          </Container>
        </section>

        {team.length > 0 ? (
          <section className="bg-slate-50">
            <Container className="py-16 md:py-20">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                The team
              </h2>
              <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((member, i) => (
                  <li key={i}>
                    {member.image ? (
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-200">
                        <Image
                          src={member.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{member.name}</h3>
                    <p className="text-sm font-medium text-brand-700">{member.role}</p>
                    {member.bio ? (
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{member.bio}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        {pillars.length > 0 ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {pillars.map((p, i) => (
                  <li key={i}>
                    <h3 className="text-base font-semibold text-slate-900">{p.headline}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        {content.finalCta ? (
          <CTA
            headline={content.finalCta.headline}
            label={content.finalCta.label}
            href={content.finalCta.url}
          />
        ) : null}
      </main>
      <Footer settings={settings} />

      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
      />
    </>
  );
}
