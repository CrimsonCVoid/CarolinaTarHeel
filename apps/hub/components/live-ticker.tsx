import { getFleetStats } from '@/lib/stats';

/*
 * §2 — Live operations ticker. Server Component, zero JS shipped.
 * The pulsing dot is pure CSS via thw-pulse-soft. While the fleet is
 * still bootstrapping (<3 live sites), the bar surfaces honest copy
 * instead of cooked numbers.
 */
export async function LiveTicker() {
  const s = await getFleetStats();
  if (s.bootstrap) {
    return (
      <div className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-3 text-xs text-slate-600">
          <span
            aria-label="Live"
            className="inline-block h-2 w-2 rounded-full bg-emerald-500 motion-safe:animate-[thw-pulse-soft_2s_ease-in-out_infinite]"
          />
          <span className="font-medium uppercase tracking-wider text-emerald-700">Live</span>
          <span className="text-slate-400">·</span>
          <span>
            Starting our fleet — {s.siteCount} site{s.siteCount === 1 ? '' : 's'} deployed so far. Stats roll in as
            real numbers replace these placeholders.
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-3 text-xs text-slate-600">
        <span
          aria-label="Live"
          className="inline-block h-2 w-2 rounded-full bg-emerald-500 motion-safe:animate-[thw-pulse-soft_2s_ease-in-out_infinite]"
        />
        <span className="font-medium uppercase tracking-wider text-emerald-700">Live</span>
        <Sep />
        <span>
          <strong className="text-slate-900">{s.siteCount}</strong> sites deployed
        </span>
        <Sep />
        <span>
          avg Lighthouse <strong className="text-slate-900">{s.avgLighthouse}</strong>
        </span>
        <Sep />
        <span>
          avg page weight <strong className="text-slate-900">{s.avgPageWeight} KB</strong>
        </span>
        <Sep />
        <span>
          avg LCP <strong className="text-slate-900">{s.avgLcp}s</strong>
        </span>
        <Sep />
        <span>
          <strong className="text-slate-900">{s.uptime}%</strong> uptime
        </span>
        <Sep />
        <span>
          <strong className="text-slate-900">{s.formsThisWeek}</strong> form submissions this week
        </span>
      </div>
    </div>
  );
}

const Sep = () => <span className="text-slate-300">·</span>;
