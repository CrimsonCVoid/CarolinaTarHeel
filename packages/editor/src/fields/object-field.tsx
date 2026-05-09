'use client';

import { renderField } from './render-field';
import type { FieldComponentProps } from '../types';

export function ObjectField({ name, meta, value, onChange, error }: FieldComponentProps) {
  const obj = (value && typeof value === 'object' ? (value as Record<string, unknown>) : {});
  const fields = meta.fields ?? {};
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5">
      <legend className="px-2 text-sm font-semibold text-slate-900">{meta.label}</legend>
      {meta.help ? <p className="mt-0.5 text-xs text-slate-500">{meta.help}</p> : null}
      <div className="mt-4 space-y-5">
        {Object.entries(fields).map(([key, child]) =>
          renderField({
            name: `${name}.${key}`,
            meta: child,
            value: obj[key],
            onChange: (next) => onChange({ ...obj, [key]: next }),
          }),
        )}
      </div>
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </fieldset>
  );
}
