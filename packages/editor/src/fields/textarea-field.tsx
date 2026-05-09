'use client';
import { Label, Textarea } from '@tarheel/ui';
import type { FieldComponentProps } from '../types';

export function TextareaField({ name, meta, value, onChange, error }: FieldComponentProps) {
  const v = typeof value === 'string' ? value : '';
  return (
    <div>
      <Label htmlFor={name}>
        {meta.label}
        {meta.required ? <span className="text-red-600"> *</span> : null}
      </Label>
      {meta.help ? <p className="mt-0.5 text-xs text-slate-500">{meta.help}</p> : null}
      <Textarea
        id={name}
        name={name}
        value={v}
        rows={4}
        maxLength={meta.maxLength}
        placeholder={meta.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5"
      />
      {meta.maxLength ? (
        <p className="mt-1 text-right text-xs text-slate-400">
          {v.length}/{meta.maxLength}
        </p>
      ) : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
