'use client';
import { Input, Label } from '@tarheel/ui';
import type { FieldComponentProps } from '../types';

export function ColorField({ name, meta, value, onChange }: FieldComponentProps) {
  const v = typeof value === 'string' ? value : '#000000';
  return (
    <div>
      <Label htmlFor={name}>{meta.label}</Label>
      <div className="mt-1.5 flex items-center gap-3">
        <input
          id={name}
          type="color"
          value={v}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-md border border-slate-300"
        />
        <Input value={v} onChange={(e) => onChange(e.target.value)} className="flex-1" />
      </div>
    </div>
  );
}
