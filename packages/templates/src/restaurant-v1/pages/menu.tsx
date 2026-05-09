import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types.js';
import type { MenuPageContent } from '../schema.js';
import { Nav } from '../../shared/nav.js';
import { Footer } from '../../shared/footer.js';

const NAV_LINKS = [
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const TAG_LABELS: Record<string, string> = {
  gf: 'GF',
  vg: 'Veg',
  v: 'Vegan',
  spicy: 'Spicy',
  popular: 'Popular',
};

export function RestaurantMenu({ content, settings }: PageRenderProps<MenuPageContent>) {
  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <section className="border-b border-slate-200 bg-white">
          <Container className="py-16 md:py-20">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              {content.hero.headline}
            </h1>
            {content.hero.note ? <p className="mt-3 text-base text-slate-600">{content.hero.note}</p> : null}
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          <div className="space-y-12 md:space-y-16">
            {content.categories.map((cat, i) => (
              <section key={i}>
                <header>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                    {cat.name}
                  </h2>
                  {cat.description ? (
                    <p className="mt-2 max-w-prose text-sm text-slate-600">{cat.description}</p>
                  ) : null}
                </header>
                <ul className="mt-6 divide-y divide-slate-200">
                  {cat.items.map((item, j) => (
                    <li key={j} className="grid grid-cols-[1fr_auto] gap-4 py-4">
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-medium text-slate-900">{item.name}</span>
                          {item.tags?.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800"
                            >
                              {TAG_LABELS[t] ?? t}
                            </span>
                          ))}
                        </div>
                        {item.description ? (
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
                        ) : null}
                      </div>
                      <span className="font-medium text-slate-900">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </main>
      <Footer settings={settings} />
    </>
  );
}
