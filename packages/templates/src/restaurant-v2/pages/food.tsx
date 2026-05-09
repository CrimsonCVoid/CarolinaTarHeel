import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { FoodPageContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { HeroCentered } from '../../shared/hero/hero-centered';
import { RichMenuItem } from '../../shared/v2/menu-item-rich';
import { OrderCTA } from '../../shared/v2/order-cta';
import { StickyOrderBar } from '../../shared/v2/sticky-order-bar';
import { JsonLd } from '../../shared/v2/jsonld';

const NAV_LINKS = [
  { label: 'Beer', href: '/beer' },
  { label: 'Food', href: '/food' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function RestaurantV2Food({ content, settings }: PageRenderProps<FoodPageContent>) {
  const categories = content.categories ?? [];
  const buildYourOwn = content.buildYourOwn;
  const toastUrl = content.toastOrderUrl;
  const orderLabel = content.orderCtaLabel ?? 'Order online';

  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main className="pb-24 md:pb-0">
        <HeroCentered
          headline={content.hero?.headline ?? 'Menu'}
          subheadline={content.hero?.subheadline ?? content.hero?.note}
          bgImage={content.hero?.backgroundImage}
        />

        {categories.length > 0 ? (
          <nav
            aria-label="Menu categories"
            className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"
          >
            <Container className="py-3">
              <ul className="flex gap-2 overflow-x-auto whitespace-nowrap text-sm">
                {categories.map((cat, i) => {
                  const slug = cat.slug ?? slugify(cat.name);
                  return (
                    <li key={i}>
                      <a
                        href={`#cat-${slug}`}
                        className="inline-flex h-9 items-center rounded-full border border-slate-200 px-4 font-medium text-slate-700 hover:border-brand-600 hover:text-brand-700"
                      >
                        {cat.name}
                      </a>
                    </li>
                  );
                })}
                {buildYourOwn?.enabled ? (
                  <li>
                    <a
                      href="#cat-build-your-own"
                      className="inline-flex h-9 items-center rounded-full border border-slate-200 px-4 font-medium text-slate-700 hover:border-brand-600 hover:text-brand-700"
                    >
                      {buildYourOwn.headline ?? 'Build Your Own'}
                    </a>
                  </li>
                ) : null}
              </ul>
            </Container>
          </nav>
        ) : null}

        <Container className="py-12 md:py-16">
          <div className="space-y-16">
            {categories.map((cat, i) => {
              const slug = cat.slug ?? slugify(cat.name);
              return (
                <section key={i} id={`cat-${slug}`} className="scroll-mt-24">
                  <header className="border-b border-slate-200 pb-4">
                    <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                      {cat.name}
                    </h2>
                    {cat.description ? (
                      <p className="mt-2 max-w-prose text-sm text-slate-600">{cat.description}</p>
                    ) : null}
                  </header>
                  <ul className="mt-6 divide-y divide-slate-200">
                    {cat.items.map((item, j) => (
                      <li key={item.slug ?? j} className="py-5">
                        <RichMenuItem item={item} layout="row" />
                      </li>
                    ))}
                  </ul>
                  {toastUrl ? (
                    <div className="mt-8">
                      <OrderCTA toastUrl={toastUrl} variant="inline" label={orderLabel} />
                    </div>
                  ) : null}
                </section>
              );
            })}

            {buildYourOwn?.enabled ? (
              <section id="cat-build-your-own" className="scroll-mt-24 rounded-2xl bg-slate-50 p-8 md:p-10">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {buildYourOwn.headline ?? 'Build Your Own'}
                </h2>
                {buildYourOwn.note ? (
                  <p className="mt-3 max-w-prose text-base text-slate-700">{buildYourOwn.note}</p>
                ) : null}

                {buildYourOwn.sizes && buildYourOwn.sizes.length > 0 ? (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sizes</h3>
                    <ul className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                      {buildYourOwn.sizes.map((size, i) => (
                        <li key={i} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4">
                          <div>
                            <span className="font-medium text-slate-900">{size.label}</span>
                            {size.description ? (
                              <p className="mt-1 text-sm text-slate-600">{size.description}</p>
                            ) : null}
                          </div>
                          <span className="font-medium text-slate-900">{size.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {buildYourOwn.toppings && buildYourOwn.toppings.length > 0 ? (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {buildYourOwn.toppingsHeadline ?? 'Toppings'}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {buildYourOwn.toppings.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                    {buildYourOwn.addOnNote ? (
                      <p className="mt-4 text-sm text-slate-600">{buildYourOwn.addOnNote}</p>
                    ) : null}
                  </div>
                ) : null}
              </section>
            ) : null}

            {toastUrl ? (
              <div className="text-center">
                <OrderCTA toastUrl={toastUrl} variant="primary" label={orderLabel} />
              </div>
            ) : null}
          </div>
        </Container>

        {toastUrl ? <StickyOrderBar toastUrl={toastUrl} label={orderLabel} /> : null}
      </main>
      <Footer settings={settings} />

      <JsonLd type="Menu" data={categories} />
      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Food', url: '/food' },
        ]}
      />
    </>
  );
}
