import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { EventsPageContent, EventItem } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { HeroCentered } from '../../shared/hero/hero-centered';
import { EventCard } from '../../shared/v2/event-card';
import { MonthCalendar } from '../../shared/v2/month-calendar';
import { JsonLd } from '../../shared/v2/jsonld';

const NAV_LINKS = [
  { label: 'Beer', href: '/beer' },
  { label: 'Food', href: '/food' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

function eventTime(value?: string): number {
  if (!value) return Number.POSITIVE_INFINITY;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
}

function monthKey(value?: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function RestaurantV2Events({ content, settings }: PageRenderProps<EventsPageContent>) {
  const upcoming: EventItem[] = [...(content.events ?? [])].sort((a, b) => eventTime(a.startsAt) - eventTime(b.startsAt));
  const recurring = content.recurring ?? [];

  const monthGroups: Array<{ label: string; items: EventItem[] }> = [];
  for (const event of upcoming) {
    const label = monthKey(event.startsAt) ?? 'Upcoming';
    const last = monthGroups[monthGroups.length - 1];
    if (last && last.label === label) last.items.push(event);
    else monthGroups.push({ label, items: [event] });
  }
  const groupByMonth = monthGroups.length > 1;

  const recurringByDay: Record<string, typeof recurring> = {};
  for (const day of DAY_ORDER) recurringByDay[day] = [];
  for (const r of recurring) {
    const arr = recurringByDay[r.dayOfWeek];
    if (arr) arr.push(r);
  }

  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <HeroCentered
          headline={content.hero?.headline ?? 'Events'}
          subheadline={content.hero?.subheadline}
          bgImage={content.hero?.backgroundImage}
        />

        <MonthCalendar events={upcoming} />

        <section className="bg-white">
          <Container className="py-16 md:py-20">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {content.upcomingHeadline ?? 'Upcoming'}
            </h2>
            {upcoming.length === 0 ? (
              <p className="mt-6 text-base text-slate-600">No upcoming events scheduled — follow us for updates.</p>
            ) : groupByMonth ? (
              <div className="mt-10 space-y-12">
                {monthGroups.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{group.label}</h3>
                    <ul className="mt-4 space-y-6">
                      {group.items.map((event, i) => (
                        <li key={event.slug ?? i} id={`event-${event.slug}`} className="scroll-mt-24">
                          <EventCard event={event} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="mt-10 space-y-6">
                {upcoming.map((event, i) => (
                  <li key={event.slug ?? i} id={`event-${event.slug}`} className="scroll-mt-24">
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </section>

        {recurring.length > 0 ? (
          <section className="bg-slate-50">
            <Container className="py-16 md:py-20">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {content.recurringHeadline ?? 'Every week'}
              </h2>
              <div className="mt-10 grid gap-4 md:grid-cols-7">
                {DAY_ORDER.map((day) => {
                  const items = recurringByDay[day] ?? [];
                  return (
                  <div key={day} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{DAY_LABELS[day]}</h3>
                    <ul className="mt-3 space-y-3">
                      {items.length === 0 ? (
                        <li className="text-xs text-slate-400">—</li>
                      ) : (
                        items.map((r, i) => (
                          <li key={i} className="text-sm">
                            <p className="font-medium text-slate-900">{r.title}</p>
                            {r.timeLabel ? <p className="text-xs text-slate-500">{r.timeLabel}</p> : null}
                            {r.description ? (
                              <p className="mt-1 text-xs text-slate-600">{r.description}</p>
                            ) : null}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  );
                })}
              </div>
            </Container>
          </section>
        ) : null}

        {content.foodTruckHeadline ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {content.foodTruckHeadline}
                </h2>
                {content.foodTruckIntro ? (
                  <p className="mt-4 text-base leading-relaxed text-slate-700">{content.foodTruckIntro}</p>
                ) : null}
                {content.bookingUrl ? (
                  <a
                    href={content.bookingUrl}
                    className="mt-8 inline-flex h-12 items-center rounded-2xl bg-brand-600 px-6 text-base font-medium text-white hover:bg-brand-700"
                    rel="noopener"
                  >
                    {content.bookingLabel ?? 'Book your truck'}
                  </a>
                ) : null}
              </div>
            </Container>
          </section>
        ) : null}
      </main>
      <Footer settings={settings} />

      {upcoming.map((event, i) => (
        <JsonLd key={event.slug ?? i} type="Event" data={event} />
      ))}
      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Events', url: '/events' },
        ]}
      />
    </>
  );
}
