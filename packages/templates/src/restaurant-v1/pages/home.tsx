import Image from 'next/image';
import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { HomeContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { HeroCentered } from '../../shared/hero/hero-centered';
import { CTA } from '../../shared/cta/index';

const NAV_LINKS = [
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function RestaurantHome({ content, settings }: PageRenderProps<HomeContent>) {
  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <HeroCentered
          headline={content.hero.headline}
          subheadline={content.hero.subheadline}
          bgImage={content.hero.backgroundImage}
          cta={
            content.hero.ctaLabel && content.hero.ctaUrl
              ? { label: content.hero.ctaLabel, href: content.hero.ctaUrl }
              : undefined
          }
        />

        <section className="bg-white">
          <Container className="py-16 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {content.intro.headline}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-700">{content.intro.body}</p>
            </div>
          </Container>
        </section>

        {content.featuredMenu.enabled ? (
          <section className="bg-slate-50">
            <Container className="py-16 md:py-20">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {content.featuredMenu.headline}
              </h2>
              <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {content.featuredMenu.items.map((item, i) => (
                  <li key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                    {item.image ? (
                      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                      <span className="font-medium text-slate-900">{item.price}</span>
                    </div>
                    {item.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        {content.testimonials && content.testimonials.length > 0 ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <ul className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                {content.testimonials.map((t, i) => (
                  <li key={i} className="rounded-2xl border border-slate-200 p-6">
                    <p className="font-display text-lg leading-snug text-slate-900">&ldquo;{t.quote}&rdquo;</p>
                    <p className="mt-4 text-sm text-slate-600">
                      — {t.author}
                      {t.source ? <span className="text-slate-400">, {t.source}</span> : null}
                    </p>
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
