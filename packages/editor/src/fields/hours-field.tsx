'use client';

import { Input, Label } from '@tarheel/ui';
import type { FieldComponentProps } from '../types.js';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const LABELS: Record<(typeof DAYS)[number], string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

interface DayVal {
  open?: string;
  close?: string;
  closed?: boolean;
}

interface HoursVal {
  mon?: DayVal;
  tue?: DayVal;
  wed?: DayVal;
  thu?: DayVal;
  fri?: DayVal;
  sat?: DayVal;
  sun?: DayVal;
  note?: string;
}

export function HoursField({ name, meta, value, onChange }: FieldComponentProps) {
  const v = (value && typeof value === 'object' ? (value as HoursVal) : {}) as HoursVal;

  function setDay(day: (typeof DAYS)[number], next: DayVal) {
    onChange({ ...v, [day]: next });
  }

  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5">
      <legend className="px-2 text-sm font-semibold text-slate-900">{meta.label}</legend>
      <div className="mt-4 space-y-3">
        {DAYS.map((d) => {
          const day = v[d] ?? {};
          return (
            <div key={d} className="grid grid-cols-[60px_1fr_1fr_auto] items-center gap-3">
              <span className="text-sm font-medium text-slate-700">{LABELS[d]}</span>
              <Input
                type="time"
                disabled={day.closed}
                value={day.open ?? ''}
                onChange={(e) => setDay(d, { ...day, open: e.target.value })}
              />
              <Input
                type="time"
                disabled={day.closed}
                value={day.close ?? ''}
                onChange={(e) => setDay(d, { ...day, close: e.target.value })}
              />
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={day.closed ?? false}
                  onChange={(e) => setDay(d, { ...day, closed: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Closed
              </label>
            </div>
          );
        })}
        <div>
          <Label htmlFor={`${name}.note`}>Note (optional)</Label>
          <Input
            id={`${name}.note`}
            value={v.note ?? ''}
            onChange={(e) => onChange({ ...v, note: e.target.value })}
            placeholder="e.g. Closed federal holidays"
            className="mt-1.5"
          />
        </div>
      </div>
    </fieldset>
  );
}
