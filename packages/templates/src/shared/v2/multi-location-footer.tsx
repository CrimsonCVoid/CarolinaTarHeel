import { Container, cn } from '@tarheel/ui';
import type { SiteSettings } from '../../types';
import type { Location } from '../../restaurant-v2/schema';

interface MultiLocationFooterProps {
  settings: SiteSettings;
  locations: Location[];
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

function todaysHoursLabel(location: Location): string {
  const idx = new Date().getDay();
  const key = DAY_KEYS[idx] ?? 'mon';
  const day = location.hours?.[key];
  if (!day || day.closed || !day.open || !day.close) return 'Closed today';
  return `Today ${day.open}–${day.close}`;
}

function telHref(phone: string): string {
  const digits = phone.replace(/\D+/g, '');
  return `tel:+1${digits.startsWith('1') ? digits.slice(1) : digits}`;
}

export function MultiLocationFooter({ settings, locations }: MultiLocationFooterProps): JSX.Element {
  const brand = settings.brand.name ?? 'Site';
  const year = new Date().getFullYear();
  const visibleLocations = locations.slice(0, 4);

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 text-sm text-slate-600">
      <Container>
        <div
          className={cn(
            'grid gap-8 sm:grid-cols-2',
            // brand + N locations + social → cap at 4 columns visually
            'lg:grid-cols-4',
          )}
        >
          <div>
            <div className="font-display text-base font-semibold text-slate-900">{brand}</div>
            {settings.contact.email ? (
              <a
                className="mt-2 inline-block hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                href={`mailto:${settings.contact.email}`}
              >
                {settings.contact.email}
              </a>
            ) : null}
            {settings.brand.primary ? null : null}
          </div>

          {visibleLocations.map((loc) => {
            const a = loc.address;
            return (
              <div key={loc.key}>
                <div className="font-medium text-slate-900">{loc.shortName}</div>
                <address className="not-italic mt-2 space-y-1 text-slate-600">
                  <div>
                    {a.line1}
                    {a.line2 ? <><br />{a.line2}</> : null}
                    <br />
                    {a.city}, {a.state} {a.postalCode}
                  </div>
                  <div>
                    <a
                      className="hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                      href={telHref(loc.phone)}
                    >
                      {loc.phone}
                    </a>
                  </div>
                  <div className="text-slate-500">{todaysHoursLabel(loc)}</div>
                </address>
              </div>
            );
          })}

          <div>
            <div className="font-medium text-slate-900">Follow</div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {(Object.entries(settings.social) as [string, string | undefined][]).map(([k, url]) =>
                url ? (
                  <li key={k}>
                    <a
                      className="capitalize hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                      href={url}
                      rel="me noopener"
                    >
                      {k}
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row">
          <span>
            © {year} {brand}. All rights reserved.
          </span>
          <span>
            Built by{' '}
            <a
              className="hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              href="https://tarheelweb.co"
              rel="noopener"
            >
              Tar Heel Web Co.
            </a>
          </span>
        </div>
      </Container>
    </footer>
  );
}
