'use client';
import type { FieldComponentProps } from '../types';

export function BooleanField({ name, meta, value, onChange }: FieldComponentProps) {
  const checked = Boolean(value);
  return (
    <label htmlFor={name} className="flex cursor-pointer items-start gap-3">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
      />
      <span>
        <span className="text-sm font-medium text-slate-900">{meta.label}</span>
        {meta.help ? <span className="block text-xs text-slate-500">{meta.help}</span> : null}
      </span>
    </label>
  );
}
