'use client';

import { Input, Label } from '@tarheel/ui';
import type { FieldComponentProps } from '../types.js';

interface AddressVal {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export function AddressField({ name, meta, value, onChange }: FieldComponentProps) {
  const v = (value && typeof value === 'object' ? (value as AddressVal) : {}) as AddressVal;
  function set<K extends keyof AddressVal>(k: K, val: string) {
    onChange({ ...v, [k]: val });
  }
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5">
      <legend className="px-2 text-sm font-semibold text-slate-900">{meta.label}</legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor={`${name}.line1`}>Street</Label>
          <Input id={`${name}.line1`} value={v.line1 ?? ''} onChange={(e) => set('line1', e.target.value)} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`${name}.line2`}>Suite / unit</Label>
          <Input id={`${name}.line2`} value={v.line2 ?? ''} onChange={(e) => set('line2', e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor={`${name}.city`}>City</Label>
          <Input id={`${name}.city`} value={v.city ?? ''} onChange={(e) => set('city', e.target.value)} className="mt-1.5" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`${name}.state`}>State</Label>
            <Input id={`${name}.state`} value={v.state ?? ''} onChange={(e) => set('state', e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor={`${name}.postalCode`}>ZIP</Label>
            <Input id={`${name}.postalCode`} value={v.postalCode ?? ''} onChange={(e) => set('postalCode', e.target.value)} className="mt-1.5" />
          </div>
        </div>
      </div>
    </fieldset>
  );
}
