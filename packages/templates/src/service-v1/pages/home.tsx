import { Container } from '@tarheel/ui';
import { Wrench, Flame, Snowflake, Droplet, Zap, Leaf, type LucideIcon } from 'lucide-react';
import type { PageRenderProps } from '../../types';
import type { HomeContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { HeroCentered } from '../../shared/hero/hero-centered';
import { CTA } from '../../shared/cta/index';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Areas', href: '/service-areas' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const ICON_MAP: Record<string, LucideIcon> = {
  wrench: Wrench,
  flame: Flame,
  snowflake: Snowflake,
  droplet: Droplet,
  bolt: Zap,
  leaf: Leaf,
};

export function ServiceHome({ content, settings }: PageRenderProps<HomeContent>) {
  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <HeroCentered
          headline={content.hero.headline}
          subheadline={content.hero.subheadline}
          bgImage={content.hero.backgroundImage}
          cta={content.hero.primaryCta ? { label: content.hero.primaryCta.label, href: content.hero.primaryCta.url } : undefined}
          secondaryCta={
            content.hero.emergencyPhone
              ? { label: `Call: ${content.hero.emergencyPhone}`, href: `tel:${content.hero.emergencyPhone.replace(/\D/g, '')}` }
              : undefined
          }
        />

        <section className="border-b border-slate-200 bg-white">
          <Container className="py-10">
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {content.trustBar.items.map((item, i) => (
                <li key={i} className="text-center md:text-left">
                  <div className="text-base font-semibold text-slate-900">{item.headline}</div>
                  {item.body ? <div className="mt-1 text-sm text-slate-600">{item.body}</div> : null}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="bg-white">
          <Container className="py-16 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {content.servicesIntro.headline}
              </h2>
              {content.servicesIntro.body ? (
                <p className="mt-6 text-lg leading-relaxed text-slate-700">{content.servicesIntro.body}</p>
              ) : null}
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {content.services.map((s, i) => {
                const Icon = ICON_MAP[s.icon] ?? Wrench;
                return (
                  <li key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
                    <Icon className="h-7 w-7 text-brand-600" aria-hidden />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
                    {s.url ? (
                      <a href={s.url} className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline">
                        Learn more →
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>

        <section className="bg-slate-50">
          <Container className="py-16 md:py-20">
            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {content.serviceAreasTeaser.headline}
                </h2>
                {content.serviceAreasTeaser.body ? (
                  <p className="mt-4 text-base leading-relaxed text-slate-700">{content.serviceAreasTeaser.body}</p>
                ) : null}
              </div>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
                {content.serviceAreasTeaser.primaryAreas.map((a) => (
                  <li key={a} className="text-base text-slate-800">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {content.testimonials && content.testimonials.length > 0 ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <ul className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                {content.testimonials.map((t, i) => (
                  <li key={i} className="rounded-2xl border border-slate-200 p-6">
                    {t.rating ? (
                      <div aria-label={`${t.rating} of 5 stars`} className="text-amber-500">
                        {'★'.repeat(t.rating)}
                        <span className="text-slate-300">{'★'.repeat(5 - t.rating)}</span>
                      </div>
                    ) : null}
                    <p className="mt-3 font-display text-lg leading-snug text-slate-900">&ldquo;{t.quote}&rdquo;</p>
                    <p className="mt-4 text-sm text-slate-600">— {t.author}</p>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        <CTA headline={content.finalCta.headline} label={content.finalCta.label} href={content.finalCta.url} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
