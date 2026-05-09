'use client';
import { Input, Label } from '@tarheel/ui';
import type { FieldComponentProps } from '../types.js';

export function NumberField({ name, meta, value, onChange, error }: FieldComponentProps) {
  const v = typeof value === 'number' ? value : '';
  return (
    <div>
      <Label htmlFor={name}>
        {meta.label}
        {meta.required ? <span className="text-red-600"> *</span> : null}
      </Label>
      {meta.help ? <p className="mt-0.5 text-xs text-slate-500">{meta.help}</p> : null}
      <Input
        id={name}
        name={name}
        type="number"
        value={v}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        className="mt-1.5"
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
