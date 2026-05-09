'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@tarheel/ui';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { Reorder, useDragControls, motion } from 'framer-motion';
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

interface Tracked {
  id: string;
  value: unknown;
}

let _idSeq = 0;
const newId = () => `i_${++_idSeq}`;

/*
 * Drag-and-drop array field (MOTION.md §4.4).
 *
 * Wraps each item in a synthetic { id, value } tuple so framer-motion's
 * Reorder.Group has stable keys to track. Items are objects without stable
 * IDs in our data model — we generate ids in component state, sync them
 * across edits/adds/removes.
 *
 * Uses a per-item drag handle (the grip icon) — clicking input fields inside
 * the item never starts a drag. Animation uses the spring physics from §4.4.
 *
 * framer-motion is allowed in the portal per MOTION.md §11. This file is
 * the single import site in @tarheel/editor — tree-shaking keeps the
 * marketing pages free of it.
 */
export function ArrayField({ name, meta, value, onChange }: FieldComponentProps) {
  const items = Array.isArray(value) ? value : [];
  const itemFields = meta.fields ?? {};
  const isLeafArray = Object.keys(itemFields).length === 1 && itemFields['_'] !== undefined;

  // Keep tracked tuples in sync with the value array, preserving identities
  // where possible so framer-motion can animate cleanly across re-renders.
  const [tracked, setTracked] = useState<Tracked[]>(() => items.map((v) => ({ id: newId(), value: v })));
  const valuesRef = useRef(items);

  useEffect(() => {
    if (valuesRef.current === items) return;
    setTracked((prev) => {
      // Match by reference when possible, fall back to position. Generates
      // new ids for items the parent introduced (e.g., undo/restore).
      const next: Tracked[] = items.map((v, i) => {
        const byRef = prev.find((p) => p.value === v);
        if (byRef) return byRef;
        return prev[i] ? { id: prev[i]!.id, value: v } : { id: newId(), value: v };
      });
      return next;
    });
    valuesRef.current = items;
  }, [items]);

  const commit = (next: Tracked[]) => {
    setTracked(next);
    valuesRef.current = next.map((t) => t.value);
    onChange(next.map((t) => t.value));
  };

  const updateAt = (index: number, nextValue: unknown) => {
    commit(tracked.map((t, i) => (i === index ? { ...t, value: nextValue } : t)));
  };
  const removeAt = (index: number) => {
    commit(tracked.filter((_, i) => i !== index));
  };
  const add = () => {
    commit([...tracked, { id: newId(), value: blankItem(itemFields) }]);
  };

  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5">
      <legend className="px-2 text-sm font-semibold text-slate-900">{meta.label}</legend>
      {meta.help ? <p className="mt-0.5 text-xs text-slate-500">{meta.help}</p> : null}

      <Reorder.Group
        axis="y"
        values={tracked}
        onReorder={commit}
        className="mt-4 space-y-3"
        as="ul"
      >
        {tracked.map((t, i) => (
          <ArrayRow
            key={t.id}
            tracked={t}
            index={i}
            isLeafArray={isLeafArray}
            itemFields={itemFields}
            itemLabel={meta.itemLabel}
            name={name}
            onUpdate={updateAt}
            onRemove={removeAt}
          />
        ))}
      </Reorder.Group>

      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={add}>
        <Plus className="mr-1 h-4 w-4" /> Add
      </Button>
    </fieldset>
  );
}

interface RowProps {
  tracked: Tracked;
  index: number;
  isLeafArray: boolean;
  itemFields: Record<string, FieldMeta>;
  itemLabel: string | undefined;
  name: string;
  onUpdate: (index: number, value: unknown) => void;
  onRemove: (index: number) => void;
}

function ArrayRow({ tracked, index, isLeafArray, itemFields, itemLabel, name, onUpdate, onRemove }: RowProps) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={tracked}
      dragListener={false}
      dragControls={controls}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 12px 32px -16px rgb(0 0 0 / 0.25)' }}
      className="rounded-xl border border-slate-200 bg-slate-50"
    >
      <div className="flex items-center justify-between gap-2 px-4 pt-3">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          aria-label="Drag to reorder"
          className="-ml-1 cursor-grab touch-none rounded p-1 text-slate-400 transition-colors duration-[var(--dur-instant)] hover:bg-slate-200 hover:text-slate-700 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="flex-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          {labelForArrayItem(itemLabel, tracked.value, index)}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded p-1 text-red-600 transition-colors duration-[var(--dur-instant)] hover:bg-red-50"
          aria-label="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <motion.div layout="position" className="px-4 pb-4">
        {isLeafArray
          ? renderField({
              name: `${name}.${index}`,
              meta: { ...itemFields['_']!, label: '' },
              value: tracked.value,
              onChange: (next) => onUpdate(index, next),
            })
          : (
              <div className="space-y-4">
                {Object.entries(itemFields).map(([key, child]) =>
                  renderField({
                    name: `${name}.${index}.${key}`,
                    meta: child,
                    value: (tracked.value as Record<string, unknown>)?.[key],
                    onChange: (next) =>
                      onUpdate(index, { ...(tracked.value as Record<string, unknown>), [key]: next }),
                  }),
                )}
              </div>
            )}
      </motion.div>
    </Reorder.Item>
  );
}
