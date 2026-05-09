import type { Location } from '../../restaurant-v2/schema';

interface NAPBlockProps {
  location: Location;
  variant?: 'full' | 'compact';
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

function telHref(phone: string): string {
  const digits = phone.replace(/\D+/g, '');
  return `tel:+1${digits.startsWith('1') ? digits.slice(1) : digits}`;
}

function todaysHoursLabel(location: Location): string {
  const idx = new Date().getDay();
  const key = DAY_KEYS[idx] ?? 'mon';
  const day = location.hours?.[key];
  if (!day || day.closed || !day.open || !day.close) return 'Closed today';
  return `Today ${day.open}–${day.close}`;
}

export function NAPBlock({ location, variant = 'full' }: NAPBlockProps): JSX.Element {
  const a = location.address;
  const phoneHref = telHref(location.phone);

  if (variant === 'compact') {
    return (
      <address className="not-italic text-sm text-slate-600">
        <span className="font-medium text-slate-900">{location.shortName}</span>
        <span className="px-1.5 text-slate-400">·</span>
        <span>
          {a.city}, {a.state}
        </span>
        <span className="px-1.5 text-slate-400">·</span>
        <a
          className="hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          href={phoneHref}
        >
          {location.phone}
        </a>
      </address>
    );
  }

  return (
    <address className="not-italic space-y-2 text-sm text-slate-700">
      <div className="font-display text-base font-semibold text-slate-900">{location.shortName}</div>
      <div>
        {a.line1}
        {a.line2 ? <><br />{a.line2}</> : null}
        <br />
        {a.city}, {a.state} {a.postalCode}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <a
          className="hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          href={phoneHref}
        >
          {location.phone}
        </a>
        {location.email ? (
          <>
            <span aria-hidden className="text-slate-300">·</span>
            <a
              className="hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              href={`mailto:${location.email}`}
            >
              {location.email}
            </a>
          </>
        ) : null}
      </div>
      <div className="text-slate-500">{todaysHoursLabel(location)}</div>
      {location.hoursNote ? <div className="text-xs text-slate-500">{location.hoursNote}</div> : null}
    </address>
  );
}
