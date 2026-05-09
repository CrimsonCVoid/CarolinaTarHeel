import { Container } from '@tarheel/ui';
import type { EventItem } from '../../restaurant-v2/schema';

/**
 * <MonthCalendar /> — server-rendered month grid for the events page.
 * Anchors on the month containing the earliest event so the grid never
 * shows up empty. Parses startsAt as ISO; ignores invalid dates. Each
 * cell shows the day number and up to two event chips with a "+N more"
 * overflow indicator. Sunday-first; weekday headers across the top.
 */

interface MonthCalendarProps {
  events: EventItem[];
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const TYPE_COLOR: Record<string, string> = {
  'live-music': 'bg-amber-100 text-amber-900',
  trivia: 'bg-violet-100 text-violet-900',
  'food-truck': 'bg-orange-100 text-orange-900',
  'tap-release': 'bg-brand-100 text-brand-800',
  community: 'bg-sky-100 text-sky-900',
  private: 'bg-slate-200 text-slate-700',
  other: 'bg-slate-100 text-slate-700',
};

interface ParsedEvent {
  event: EventItem;
  date: Date;
  dayKey: string;
}

function parseEvents(events: EventItem[]): ParsedEvent[] {
  const out: ParsedEvent[] = [];
  for (const e of events) {
    if (!e.startsAt) continue;
    const d = new Date(e.startsAt);
    if (Number.isNaN(d.valueOf())) continue;
    const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    out.push({ event: e, date: d, dayKey });
  }
  return out.sort((a, b) => a.date.valueOf() - b.date.valueOf());
}

export function MonthCalendar({ events }: MonthCalendarProps): JSX.Element | null {
  const parsed = parseEvents(events);
  if (parsed.length === 0) return null;

  const anchor = parsed[0]!.date;
  const year = anchor.getFullYear();
  const month = anchor.getMonth();

  const eventsByDay = new Map<string, ParsedEvent[]>();
  for (const p of parsed) {
    if (p.date.getFullYear() !== year || p.date.getMonth() !== month) continue;
    const list = eventsByDay.get(p.dayKey) ?? [];
    list.push(p);
    eventsByDay.set(p.dayKey, list);
  }

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDay = today.getDate();

  const cells: { day: number | null; entries: ParsedEvent[] }[] = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < firstWeekday || i >= firstWeekday + daysInMonth) {
      cells.push({ day: null, entries: [] });
    } else {
      const day = i - firstWeekday + 1;
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({ day, entries: eventsByDay.get(key) ?? [] });
    }
  }

  const totalThisMonth = Array.from(eventsByDay.values()).reduce((n, arr) => n + arr.length, 0);

  return (
    <section className="bg-white" data-spec-calendar>
      <Container className="py-12 md:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">This month</p>
              <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {MONTHS[month]} {year}
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              {totalThisMonth} event{totalThisMonth === 1 ? '' : 's'} on the calendar
            </p>
          </header>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {WEEKDAYS.map((d) => (
              <div key={d} className="pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {d}
              </div>
            ))}
            {cells.map((cell, i) => {
              const empty = cell.day === null;
              const isToday = !empty && isCurrentMonth && cell.day === todayDay;
              return (
                <div
                  key={i}
                  className={[
                    'flex min-h-[88px] flex-col rounded-xl p-1.5 text-left md:min-h-[110px] md:p-2',
                    empty ? 'bg-slate-50/50' : 'border border-slate-200 bg-white',
                    isToday ? '!border-brand-600 !bg-brand-50' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {!empty ? (
                    <>
                      <div
                        className={[
                          'text-sm font-semibold',
                          cell.entries.length > 0 ? 'text-slate-900' : 'text-slate-400',
                          isToday ? '!text-brand-700' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {cell.day}
                      </div>
                      <div className="mt-1 space-y-1">
                        {cell.entries.slice(0, 2).map((p, j) => (
                          <a
                            key={j}
                            href={`#event-${p.event.slug}`}
                            className={[
                              'block truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight md:text-[11px]',
                              TYPE_COLOR[p.event.type] ?? TYPE_COLOR.other!,
                            ].join(' ')}
                            title={p.event.title}
                          >
                            {p.event.title}
                          </a>
                        ))}
                        {cell.entries.length > 2 ? (
                          <div className="text-[10px] font-medium text-slate-500">+{cell.entries.length - 2} more</div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>

          <footer className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-5 text-xs">
            <Legend label="Live music" className={TYPE_COLOR['live-music']!} />
            <Legend label="Trivia" className={TYPE_COLOR.trivia!} />
            <Legend label="Food truck" className={TYPE_COLOR['food-truck']!} />
            <Legend label="Tap release" className={TYPE_COLOR['tap-release']!} />
            <Legend label="Community" className={TYPE_COLOR.community!} />
          </footer>
        </div>
      </Container>
    </section>
  );
}

function Legend({ label, className }: { label: string; className: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={['h-2.5 w-2.5 rounded', className.split(' ')[0]!].join(' ')} aria-hidden />
      <span className="text-slate-600">{label}</span>
    </span>
  );
}
