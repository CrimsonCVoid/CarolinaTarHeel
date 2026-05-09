'use client';
import { Label } from '@tarheel/ui';
import type { FieldComponentProps } from '../types.js';

export function SelectField({ name, meta, value, onChange, error }: FieldComponentProps) {
  const v = typeof value === 'string' ? value : '';
  const options = meta.options ?? [];
  return (
    <div>
      <Label htmlFor={name}>
        {meta.label}
        {meta.required ? <span className="text-red-600"> *</span> : null}
      </Label>
      <select
        id={name}
        name={name}
        value={v}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <option value="">— Select —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
