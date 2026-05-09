import Image from 'next/image';
import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { ServicesPageContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Areas', href: '/service-areas' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function ServicePagesList({ content, settings }: PageRenderProps<ServicesPageContent>) {
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
          <div className="space-y-16">
            {content.services.map((s, i) => (
              <section key={i} className="grid items-start gap-10 lg:grid-cols-2">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                    {s.name}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-700">{s.body}</p>
                  {s.bullets && s.bullets.length > 0 ? (
                    <ul className="mt-6 list-inside list-disc space-y-1 text-base text-slate-700">
                      {s.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {s.image ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                    <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </Container>
      </main>
      <Footer settings={settings} />
    </>
  );
}
