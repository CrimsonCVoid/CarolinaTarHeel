import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { AreasPageContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Areas', href: '/service-areas' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function ServiceAreas({ content, settings }: PageRenderProps<AreasPageContent>) {
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
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
            {content.areas.map((a, i) => (
              <li key={i} className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900">
                {a.name}
                {a.zip ? <span className="ml-2 text-sm text-slate-500">{a.zip}</span> : null}
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer settings={settings} />
    </>
  );
}
