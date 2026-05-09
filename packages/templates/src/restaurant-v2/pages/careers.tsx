import { Container, Card, CardHeader, CardTitle, CardContent, CardFooter, Badge } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { CareersPageContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { HeroCentered } from '../../shared/hero/hero-centered';
import { JsonLd } from '../../shared/v2/jsonld';

const NAV_LINKS = [
  { label: 'Beer', href: '/beer' },
  { label: 'Food', href: '/food' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  seasonal: 'Seasonal',
  contract: 'Contract',
};

const LOCATION_LABELS: Record<string, string> = {
  sweetwater: 'Sweetwater',
  'windy-road': 'Windy Road',
};

export function RestaurantV2Careers({ content, settings }: PageRenderProps<CareersPageContent>) {
  const openings = content.openings ?? [];
  const applyEmail = content.apply?.email;

  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <HeroCentered
          headline={content.hero?.headline ?? 'Careers'}
          subheadline={content.hero?.subheadline}
          bgImage={content.hero?.backgroundImage}
        />

        {content.intro ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <p className="mx-auto max-w-3xl whitespace-pre-line text-base leading-relaxed text-slate-700">
                {content.intro}
              </p>
            </Container>
          </section>
        ) : null}

        <section className="bg-slate-50">
          <Container className="py-16 md:py-20">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Open roles
            </h2>
            {openings.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="text-base text-slate-600">
                  {content.emptyStateMessage ??
                    'No openings posted right now — but we always want to meet good people. Send us a note.'}
                </p>
                {applyEmail ? (
                  <a
                    className="mt-6 inline-flex h-11 items-center rounded-2xl bg-brand-600 px-5 text-sm font-medium text-white hover:bg-brand-700"
                    href={`mailto:${applyEmail}`}
                  >
                    Email {applyEmail}
                  </a>
                ) : null}
              </div>
            ) : (
              <ul className="mt-10 grid gap-6 md:grid-cols-2">
                {openings.map((job, i) => (
                  <li key={i}>
                    <Card>
                      <CardHeader>
                        <div className="flex flex-wrap items-center gap-2">
                          {job.locationKey ? (
                            <Badge variant="muted">{LOCATION_LABELS[job.locationKey] ?? job.locationKey}</Badge>
                          ) : null}
                          <Badge>{TYPE_LABELS[job.type] ?? job.type}</Badge>
                        </div>
                        <CardTitle className="mt-3">{job.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed text-slate-700">{job.description}</p>
                      </CardContent>
                      <CardFooter>
                        {job.applyUrl ? (
                          <a
                            href={job.applyUrl}
                            className="inline-flex h-10 items-center rounded-2xl bg-brand-600 px-5 text-sm font-medium text-white hover:bg-brand-700"
                            rel="noopener"
                          >
                            Apply
                          </a>
                        ) : applyEmail ? (
                          <a
                            href={`mailto:${applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                            className="inline-flex h-10 items-center rounded-2xl bg-brand-600 px-5 text-sm font-medium text-white hover:bg-brand-700"
                          >
                            Email to apply
                          </a>
                        ) : null}
                      </CardFooter>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </section>

        {content.apply ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {content.apply.headline}
                </h2>
                {content.apply.body ? (
                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-700">
                    {content.apply.body}
                  </p>
                ) : null}
                {content.apply.email ? (
                  <a
                    className="mt-8 inline-flex h-12 items-center rounded-2xl bg-brand-600 px-6 text-base font-medium text-white hover:bg-brand-700"
                    href={`mailto:${content.apply.email}`}
                  >
                    {content.apply.email}
                  </a>
                ) : null}
              </div>
            </Container>
          </section>
        ) : null}
      </main>
      <Footer settings={settings} />

      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Careers', url: '/careers' },
        ]}
      />
    </>
  );
}
