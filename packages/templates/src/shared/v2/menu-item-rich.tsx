import Image from 'next/image';
import { Card, CardContent, Badge, cn } from '@tarheel/ui';
import type { MenuItemRich } from '../../restaurant-v2/schema';

interface RichMenuItemProps {
  item: MenuItemRich;
  layout?: 'card' | 'row';
}

const DIETARY_LABEL: Record<string, string> = {
  vegetarian: 'Veg',
  vegan: 'V',
  gf: 'GF',
  'gf-available': 'GF avail.',
  'contains-pork': 'Pork',
  spicy: 'Spicy',
  popular: 'Popular',
  featured: 'Featured',
};

function PriceBlock({ item, className }: { item: MenuItemRich; className?: string }) {
  const hasSizes = !!(item.priceSmall || item.priceLarge);
  if (hasSizes) {
    return (
      <div className={cn('flex shrink-0 items-baseline gap-2 text-sm font-medium text-slate-900', className)}>
        {item.priceSmall ? (
          <span>
            <span className="text-xs uppercase tracking-wide text-slate-500">SM</span>{' '}
            <span>{item.priceSmall}</span>
          </span>
        ) : null}
        {item.priceSmall && item.priceLarge ? <span className="text-slate-300">·</span> : null}
        {item.priceLarge ? (
          <span>
            <span className="text-xs uppercase tracking-wide text-slate-500">LG</span>{' '}
            <span>{item.priceLarge}</span>
          </span>
        ) : null}
      </div>
    );
  }
  if (item.price) {
    return (
      <div className={cn('shrink-0 text-sm font-semibold text-slate-900', className)}>{item.price}</div>
    );
  }
  return null;
}

function DietaryTags({ tags }: { tags?: MenuItemRich['dietaryTags'] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <li key={t}>
          <Badge variant="muted">{DIETARY_LABEL[t] ?? t}</Badge>
        </li>
      ))}
    </ul>
  );
}

export function RichMenuItem({ item, layout = 'card' }: RichMenuItemProps): JSX.Element {
  if (layout === 'row') {
    return (
      <article className="flex items-start justify-between gap-6 border-b border-slate-100 py-4 last:border-b-0">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-base font-semibold text-slate-900">{item.name}</h3>
            <DietaryTags tags={item.dietaryTags} />
          </div>
          {item.description ? (
            <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
          ) : null}
          {item.pairsWith ? (
            <p className="text-xs italic text-slate-500">Pairs with: {item.pairsWith}</p>
          ) : null}
        </div>
        <PriceBlock item={item} />
      </article>
    );
  }

  // card
  return (
    <Card className="flex h-full flex-col overflow-hidden hover:shadow-md">
      {item.image ? (
        <div className="relative aspect-[4/3] w-full bg-slate-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight text-slate-900">
            {item.name}
          </h3>
          <PriceBlock item={item} />
        </div>
        <DietaryTags tags={item.dietaryTags} />
        {item.description ? (
          <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
        ) : null}
        {item.pairsWith ? (
          <p className="mt-auto text-xs italic text-slate-500">Pairs with: {item.pairsWith}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
