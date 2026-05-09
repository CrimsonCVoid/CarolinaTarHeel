'use client';

import { useTransition, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { applyThemePreset } from '@/app/(portal)/sites/[id]/settings/actions';

interface Preset {
  id: string;
  label: string;
  primary: string;
  swatches: string[];
  font?: string;
  vibe: string;
}

const PRESETS: Preset[] = [
  {
    id: 'carolina-blue',
    label: 'Carolina Blue',
    primary: '#33658C',
    swatches: ['#162636', '#2B5272', '#33658C', '#9CBED9'],
    vibe: 'Default · classic Tar Heel',
  },
  {
    id: 'pine',
    label: 'Pine',
    primary: '#1F4A40',
    swatches: ['#0F2A24', '#1F4A40', '#5C8D89', '#FAF7F2'],
    vibe: 'Forest · restaurants, outdoors',
  },
  {
    id: 'ember',
    label: 'Ember',
    primary: '#B8492C',
    swatches: ['#3A1F18', '#7A2E1A', '#B8492C', '#E0A458'],
    vibe: 'Warm · barbecue, bakeries, salons',
  },
  {
    id: 'slate',
    label: 'Slate',
    primary: '#1E293B',
    swatches: ['#0F172A', '#1E293B', '#475569', '#E2E8F0'],
    vibe: 'Neutral · law, finance, professional',
  },
  {
    id: 'sage',
    label: 'Sage',
    primary: '#5C8D89',
    swatches: ['#2C4A48', '#5C8D89', '#A6BFB6', '#F2F0E8'],
    vibe: 'Calm · med spas, wellness',
  },
  {
    id: 'sand',
    label: 'Sand',
    primary: '#A1845C',
    swatches: ['#3D2E1A', '#7A6240', '#A1845C', '#F5EFE0'],
    vibe: 'Coastal · beach towns, hospitality',
  },
];

interface Props {
  siteId: string;
  currentPrimary?: string;
}

/*
 * Brand presets — quick-pick palettes that overwrite the site's brand
 * primary color. Click applies via server action; a small toast confirms.
 * This is the "customizability" hook for clients without forcing them
 * into a color picker on day one — they pick a vibe, we map it to a
 * palette already road-tested in production.
 */
export function ThemePresets({ siteId, currentPrimary }: Props) {
  const [pending, start] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const matched = PRESETS.find((p) => p.primary.toLowerCase() === (currentPrimary ?? '').toLowerCase())?.id;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">Theme</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Pick a vibe — we apply a road-tested palette and your site previews update instantly.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PRESETS.map((p) => {
          const selected = activeId === p.id || (!activeId && matched === p.id);
          return (
            <button
              key={p.id}
              type="button"
              disabled={pending}
              onClick={() => {
                setActiveId(p.id);
                start(async () => {
                  await applyThemePreset(siteId, p.primary);
                });
              }}
              className={`group relative flex flex-col items-stretch gap-2 rounded-2xl border p-3 text-left transition-[border-color,transform,box-shadow] duration-[var(--dur-fast)] ${
                selected
                  ? 'border-brand-600 ring-2 ring-brand-200'
                  : 'border-slate-200 hover:-translate-y-0.5 hover:border-brand-300'
              } disabled:opacity-50`}
            >
              <div className="flex h-10 overflow-hidden rounded-md">
                {p.swatches.map((s, i) => (
                  <span key={i} style={{ background: s }} className="flex-1" />
                ))}
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-slate-900">{p.label}</span>
                {selected ? (
                  pending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-600" />
                  ) : (
                    <Check className="h-3.5 w-3.5 text-brand-600" />
                  )
                ) : null}
              </div>
              <span className="text-[11px] text-slate-500">{p.vibe}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
