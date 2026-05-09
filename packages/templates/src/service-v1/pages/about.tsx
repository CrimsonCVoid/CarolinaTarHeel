import Image from 'next/image';
import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { AboutPageContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Areas', href: '/service-areas' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function ServiceAbout({ content, settings }: PageRenderProps<AboutPageContent>) {
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
              <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">{content.story.body}</p>
            </div>
            {content.story.image ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
                <Image src={content.story.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
            ) : null}
          </div>

          {content.team && content.team.length > 0 ? (
            <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {content.team.map((m, i) => (
                <li key={i}>
                  {m.photo ? (
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                      <Image src={m.photo} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                    </div>
                  ) : null}
                  <div className="mt-3 text-base font-semibold text-slate-900">{m.name}</div>
                  <div className="text-sm text-slate-500">{m.role}</div>
                  {m.bio ? <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.bio}</p> : null}
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
