import type { WeeklyHours } from '../types';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

const DAYS: Array<{ key: DayKey; label: string }> = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

export function Hours({ hours }: { hours: WeeklyHours }) {
  return (
    <dl className="divide-y divide-slate-200">
      {DAYS.map(({ key, label }) => {
        const day = hours[key];
        const value = day?.closed ? 'Closed' : day?.open && day?.close ? `${day.open}–${day.close}` : '—';
        return (
          <div key={key} className="flex justify-between py-2 text-sm">
            <dt className="font-medium text-slate-900">{label}</dt>
            <dd className="text-slate-600">{value}</dd>
          </div>
        );
      })}
      {hours.note ? <p className="pt-3 text-xs text-slate-500">{hours.note}</p> : null}
    </dl>
  );
}
