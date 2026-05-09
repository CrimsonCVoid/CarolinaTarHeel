import Image from 'next/image';
import { Card, CardContent, CardTitle, Badge, cn } from '@tarheel/ui';
import { MapPin, Phone, Clock } from 'lucide-react';
import type { Location } from '../../restaurant-v2/schema';
import { MapEmbed } from '../map-embed';
import { OrderCTA } from './order-cta';

interface LocationCardProps {
  location: Location;
  variant?: 'grid' | 'detail';
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
type DayKey = (typeof DAY_KEYS)[number];

const FEATURE_LABEL: Record<string, string> = {
  kitchen: 'Kitchen',
  'food-trucks': 'Food trucks',
  patio: 'Patio',
  'dog-friendly': 'Dog-friendly',
  'kid-friendly': 'Kid-friendly',
  reservations: 'Reservations',
  'private-events': 'Private events',
  'live-music': 'Live music',
  parking: 'Parking',
};

function todaysHoursLabel(location: Location): string {
  const idx = new Date().getDay();
  const key = DAY_KEYS[idx] as DayKey;
  const day = location.hours?.[key];
  if (!day || day.closed || !day.open || !day.close) return 'Closed today';
  return `Open today: ${day.open}–${day.close}`;
}

function mapsHref(location: Location): string {
  const a = location.address;
  const q = encodeURIComponent(`${a.line1}, ${a.city}, ${a.state} ${a.postalCode}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function telHref(phone: string): string {
  const digits = phone.replace(/\D+/g, '');
  return `tel:+1${digits.startsWith('1') ? digits.slice(1) : digits}`;
}

export function LocationCard({ location, variant = 'grid' }: LocationCardProps): JSX.Element {
  const a = location.address;
  const oneLineAddress = `${a.line1}, ${a.city}, ${a.state}`;
  const features = location.features ?? [];
  const todays = todaysHoursLabel(location);
  const directionsUrl = mapsHref(location);

  if (variant === 'detail') {
    return (
      <Card data-card="hover" className="group overflow-hidden">
        {location.primaryPhoto ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
            <Image
              src={location.primaryPhoto}
              alt={location.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>
        ) : null}
        <CardContent className="space-y-5 p-6 pt-6">
          <div>
            <CardTitle className="font-display text-2xl">{location.shortName}</CardTitle>
            {location.tagline ? (
              <p className="mt-1 text-sm text-slate-600">{location.tagline}</p>
            ) : null}
          </div>

          <address className="not-italic space-y-2 text-sm text-slate-700">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <span>
                {a.line1}
                {a.line2 ? <><br />{a.line2}</> : null}
                <br />
                {a.city}, {a.state} {a.postalCode}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <a
                className="hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                href={telHref(location.phone)}
              >
                {location.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <span>{todays}</span>
            </div>
          </address>

          {features.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {features.map((f) => (
                <li key={f}>
                  <Badge variant="muted">{FEATURE_LABEL[f] ?? f}</Badge>
                </li>
              ))}
            </ul>
          ) : null}

          <MapEmbed address={a} />

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex h-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
              )}
            >
              Get directions
            </a>
            {location.toastOrderUrl ? (
              <OrderCTA toastUrl={location.toastOrderUrl} variant="primary" />
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  }

  // grid
  return (
    <Card
      data-card="hover"
      className={cn(
        'group flex h-full flex-col overflow-hidden hover:shadow-md',
        'focus-within:ring-2 focus-within:ring-brand-500',
      )}
    >
      {location.primaryPhoto ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={location.primaryPhoto}
            alt={location.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900/40 to-transparent" aria-hidden />
        </div>
      ) : null}

      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <CardTitle className="font-display text-xl">{location.shortName}</CardTitle>
          {location.tagline ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{location.tagline}</p>
          ) : null}
        </div>

        <p className="text-sm text-slate-600">{oneLineAddress}</p>

        <p className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
          <Clock className="h-4 w-4 text-slate-400" aria-hidden />
          {todays}
        </p>

        {features.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {features.slice(0, 4).map((f) => (
              <li key={f}>
                <Badge variant="muted">{FEATURE_LABEL[f] ?? f}</Badge>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex h-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
            )}
          >
            Get directions
          </a>
          {location.toastOrderUrl ? (
            <OrderCTA toastUrl={location.toastOrderUrl} variant="inline" />
          ) : (
            <a
              href={`/locations/${location.key}`}
              className={cn(
                'inline-flex h-10 items-center justify-center rounded-2xl bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
              )}
            >
              View location
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
