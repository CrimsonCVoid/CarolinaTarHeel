import { Card, CardContent, Badge, cn } from '@tarheel/ui';
import { CalendarPlus, MapPin, Ticket } from 'lucide-react';
import type { EventItem, Location } from '../../restaurant-v2/schema';

interface EventCardProps {
  event: EventItem;
  location?: Location;
}

const LOCATION_LABEL: Record<string, string> = {
  sweetwater: 'Sweetwater',
  'windy-road': 'Windy Road',
};

const TYPE_LABEL: Record<EventItem['type'], string> = {
  'live-music': 'Live music',
  trivia: 'Trivia',
  'food-truck': 'Food truck',
  'tap-release': 'Tap release',
  community: 'Community',
  private: 'Private',
  other: 'Event',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function titleCase(key: string): string {
  return key
    .split('-')
    .map((p) => (p && p[0] ? p[0].toUpperCase() + p.slice(1) : p))
    .join(' ');
}

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toGCalStamp(d: Date): string {
  // YYYYMMDDTHHmmssZ
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + '…';
}

export function EventCard({ event, location }: EventCardProps): JSX.Element {
  const start = parseDate(event.startsAt);
  const endRaw = parseDate(event.endsAt);
  const end = endRaw ?? (start ? new Date(start.getTime() + 2 * 60 * 60 * 1000) : null);

  const dayNum = start ? start.getDate() : null;
  const monthLabel = start ? MONTHS[start.getMonth()] : null;
  const timeLabel = start
    ? start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null;

  const locLabel = event.locationKey
    ? LOCATION_LABEL[event.locationKey] ?? titleCase(event.locationKey)
    : location?.shortName;

  let gcalUrl: string | null = null;
  if (start && end) {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${toGCalStamp(start)}/${toGCalStamp(end)}`,
    });
    if (locLabel) params.set('location', locLabel);
    if (event.description) params.set('details', event.description);
    gcalUrl = `https://www.google.com/calendar/render?${params.toString()}`;
  }

  return (
    <Card className="flex h-full overflow-hidden hover:shadow-md">
      <CardContent className="flex w-full gap-5 p-5">
        {start ? (
          <div className="shrink-0">
            <time
              dateTime={start.toISOString()}
              className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-brand-50 text-brand-800"
            >
              <span className="text-xs font-semibold uppercase tracking-wide">{monthLabel}</span>
              <span className="font-display text-3xl font-semibold leading-none">{dayNum}</span>
            </time>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted">{TYPE_LABEL[event.type] ?? 'Event'}</Badge>
            {timeLabel ? <span className="text-xs text-slate-500">{timeLabel}</span> : null}
          </div>

          <h3 className="font-display text-lg font-semibold leading-tight text-slate-900">
            {event.title}
          </h3>

          {locLabel ? (
            <p className="flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              {locLabel}
            </p>
          ) : null}

          {event.description ? (
            <p className="text-sm leading-relaxed text-slate-600">
              {truncate(event.description, 140)}
            </p>
          ) : null}

          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {gcalUrl ? (
              <a
                href={gcalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex h-9 items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-3 text-xs font-medium text-slate-900 hover:bg-slate-50',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
                )}
              >
                <CalendarPlus className="h-3.5 w-3.5" aria-hidden />
                Add to calendar
              </a>
            ) : null}
            {event.ticketUrl ? (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex h-9 items-center gap-1.5 rounded-2xl bg-brand-600 px-3 text-xs font-semibold text-white hover:bg-brand-700',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
                )}
              >
                <Ticket className="h-3.5 w-3.5" aria-hidden />
                Tickets
              </a>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
