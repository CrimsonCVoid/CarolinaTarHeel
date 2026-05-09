import Image from 'next/image';
import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types.js';
import type { AboutPageContent } from '../schema.js';
import { Nav } from '../../shared/nav.js';
import { Footer } from '../../shared/footer.js';

const NAV_LINKS = [
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function RestaurantAbout({ content, settings }: PageRenderProps<AboutPageContent>) {
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

        <Container className="py-16 md:py-20">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
                {content.story.headline}
              </h2>
              <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">
                {content.story.body}
              </p>
            </div>
            {content.story.image ? (
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

          {content.values && content.values.length > 0 ? (
            <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {content.values.map((v, i) => (
                <li key={i}>
                  <h3 className="text-base font-semibold text-slate-900">{v.headline}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.body}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </main>
      <Footer settings={settings} />
    </>
  );
}
