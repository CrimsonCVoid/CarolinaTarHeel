import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle, Badge } from '@tarheel/ui';
import { ExternalLink } from 'lucide-react';
import type { Beer } from '../../restaurant-v2/schema';

interface BeerCardProps {
  beer: Beer;
}

const LOCATION_LABEL: Record<string, string> = {
  sweetwater: 'Sweetwater',
  'windy-road': 'Windy Road',
};

function titleCase(key: string): string {
  return key
    .split('-')
    .map((p) => (p && p[0] ? p[0].toUpperCase() + p.slice(1) : p))
    .join(' ');
}

/** Map beer style → gradient that visually keys to the beer's color in the
 *  glass. Used as a hero strip when no photo is available, so a tap list
 *  reads like a bar's chalkboard rather than a wall of text. */
function styleGradient(style: string): string {
  const s = style.toLowerCase();
  if (/baltic porter|porter|stout/.test(s)) return 'linear-gradient(135deg, #4a2410, #1a0e08)';
  if (/hazy|new england|neipa/.test(s)) return 'linear-gradient(135deg, #f3b450, #c47a16)';
  if (/ipa|pale ale/.test(s)) return 'linear-gradient(135deg, #7ea03a, #3a5215)';
  if (/wheat|hefe|witbier/.test(s)) return 'linear-gradient(135deg, #f0d27d, #b08a26)';
  if (/amber|red|copper/.test(s)) return 'linear-gradient(135deg, #d18a3a, #7a3f0a)';
  if (/pilsner|lager|kolsch|helles/.test(s)) return 'linear-gradient(135deg, #f5dc73, #c4972a)';
  if (/sour|gose|berliner/.test(s)) return 'linear-gradient(135deg, #f2c2d6, #b6537a)';
  return 'linear-gradient(135deg, #94a3b8, #475569)';
}

export function BeerCard({ beer }: BeerCardProps): JSX.Element {
  const stats: string[] = [];
  if (typeof beer.abv === 'number') stats.push(`${beer.abv.toFixed(1)}% ABV`);
  if (typeof beer.ibu === 'number') stats.push(`${Math.round(beer.ibu)} IBU`);

  return (
    <Card data-card="hover" className="flex h-full flex-col overflow-hidden hover:shadow-md">
      {beer.image ? (
        <div className="relative aspect-[4/3] w-full bg-slate-100">
          <Image
            src={beer.image}
            alt={beer.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          aria-hidden
          className="relative h-24 w-full overflow-hidden"
          style={{ backgroundImage: styleGradient(beer.style) }}
        >
          <span className="absolute inset-x-4 bottom-2 truncate font-display text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
            {beer.style}
          </span>
        </div>
      )}

      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="space-y-1">
          <CardTitle className="font-display text-lg leading-tight">{beer.name}</CardTitle>
          <p className="text-xs uppercase tracking-wide text-slate-500">{beer.style}</p>
        </div>

        {stats.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {stats.map((s) => (
              <li key={s}>
                <Badge variant="muted">{s}</Badge>
              </li>
            ))}
          </ul>
        ) : null}

        {beer.tastingNotes ? (
          <p className="text-sm leading-relaxed text-slate-600">{beer.tastingNotes}</p>
        ) : beer.description ? (
          <p className="text-sm leading-relaxed text-slate-600">{beer.description}</p>
        ) : null}

        {beer.pairingSuggestion ? (
          <p className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Pairs with:</span> {beer.pairingSuggestion}
          </p>
        ) : null}

        {beer.servedAt && beer.servedAt.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {beer.servedAt.map((k) => (
              <li key={k}>
                <Badge variant="muted">{LOCATION_LABEL[k] ?? titleCase(k)}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>

      {(beer.isFlagship || beer.isCurrentlyOnTap || beer.untappdUrl) && (
        <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-6 py-3 pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {beer.isFlagship ? <Badge variant="default">Flagship</Badge> : null}
            {beer.isCurrentlyOnTap ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                On tap
              </span>
            ) : null}
          </div>
          {beer.untappdUrl ? (
            <a
              href={beer.untappdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Untappd
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          ) : null}
        </CardFooter>
      )}
    </Card>
  );
}
