'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FieldMeta } from '@tarheel/templates';
import { renderField } from './fields/render-field.js';

export interface FormFromSchemaProps {
  meta: Record<string, FieldMeta>;
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  /** Called with debounced value on every change. */
  onAutosave?: (next: Record<string, unknown>) => void;
  autosaveMs?: number;
}

export function FormFromSchema({ meta, value, onChange, onAutosave, autosaveMs = 1500 }: FormFromSchemaProps) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  const onAutosaveRef = useRef(onAutosave);
  onChangeRef.current = onChange;
  onAutosaveRef.current = onAutosave;

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const update = useCallback(
    (key: string, next: unknown) => {
      const merged = { ...local, [key]: next };
      setLocal(merged);
      onChangeRef.current(merged);
      if (timer.current) clearTimeout(timer.current);
      if (onAutosaveRef.current) {
        timer.current = setTimeout(() => onAutosaveRef.current?.(merged), autosaveMs);
      }
    },
    [local, autosaveMs],
  );

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <div className="space-y-6">
      {Object.entries(meta).map(([key, fieldMeta]) =>
        renderField({
          name: key,
          meta: fieldMeta,
          value: local[key],
          onChange: (next) => update(key, next),
        }),
      )}
    </div>
  );
}
