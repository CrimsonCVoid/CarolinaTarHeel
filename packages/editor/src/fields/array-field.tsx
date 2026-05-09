'use client';

import { Button } from '@tarheel/ui';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { renderField } from './render-field';
import type { FieldComponentProps } from '../types';
import type { FieldMeta } from '@tarheel/templates';

function blankItem(fields: Record<string, FieldMeta> | undefined): unknown {
  if (!fields) return '';
  const single = fields['_'];
  if (single && Object.keys(fields).length === 1) {
    return single.kind === 'boolean' ? false : '';
  }
  const out: Record<string, unknown> = {};
  for (const [k, m] of Object.entries(fields)) {
    out[k] = m.kind === 'boolean' ? false : m.kind === 'array' ? [] : m.kind === 'object' ? {} : '';
  }
  return out;
}

function labelForArrayItem(itemLabel: string | undefined, item: unknown, index: number): string {
  if (!itemLabel) return `Item ${index + 1}`;
  if (itemLabel === '_') return typeof item === 'string' ? item || `Item ${index + 1}` : `Item ${index + 1}`;
  if (item && typeof item === 'object') {
    const v = (item as Record<string, unknown>)[itemLabel];
    if (typeof v === 'string' && v.length > 0) return v;
  }
  return `Item ${index + 1}`;
}

export function ArrayField({ name, meta, value, onChange }: FieldComponentProps) {
  const items = Array.isArray(value) ? value : [];
  const itemFields = meta.fields ?? {};
  const isLeafArray = Object.keys(itemFields).length === 1 && itemFields['_'] !== undefined;

  function update(i: number, next: unknown) {
    const copy = items.slice();
    copy[i] = next;
    onChange(copy);
  }
  function remove(i: number) {
    onChange(items.filter((_, j) => j !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = items.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  }
  function add() {
    onChange([...items, blankItem(itemFields)]);
  }

  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5">
      <legend className="px-2 text-sm font-semibold text-slate-900">{meta.label}</legend>
      {meta.help ? <p className="mt-0.5 text-xs text-slate-500">{meta.help}</p> : null}
      <ul className="mt-4 space-y-4">
        {items.map((item, i) => (
          <li key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {labelForArrayItem(meta.itemLabel, item, i)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="rounded p-1 text-slate-500 hover:bg-slate-200"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  className="rounded p-1 text-slate-500 hover:bg-slate-200"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded p-1 text-red-600 hover:bg-red-50"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {isLeafArray
              ? renderField({
                  name: `${name}.${i}`,
                  meta: { ...itemFields['_']!, label: '' },
                  value: item,
                  onChange: (next) => update(i, next),
                })
              : (
                <div className="space-y-4">
                  {Object.entries(itemFields).map(([key, child]) =>
                    renderField({
                      name: `${name}.${i}.${key}`,
                      meta: child,
                      value: (item as Record<string, unknown>)?.[key],
                      onChange: (next) => update(i, { ...(item as Record<string, unknown>), [key]: next }),
                    }),
                  )}
                </div>
              )}
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={add}>
        <Plus className="mr-1 h-4 w-4" /> Add
      </Button>
    </fieldset>
  );
}
