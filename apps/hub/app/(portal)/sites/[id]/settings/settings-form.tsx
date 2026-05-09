'use client';

import { useState, useTransition } from 'react';
import { Button } from '@tarheel/ui';
import { EditorProvider, FormFromSchema } from '@tarheel/editor';
import type { FieldMeta } from '@tarheel/templates';
import { saveSiteSettings } from './actions';
import { uploadMedia } from '../pages/[slug]/edit/actions';

export function SettingsForm({
  siteId,
  meta,
  initial,
}: {
  siteId: string;
  meta: Record<string, FieldMeta>;
  initial: Record<string, unknown>;
}) {
  const [value, setValue] = useState(initial);
  const [pending, start] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  return (
    <EditorProvider
      value={{
        siteId,
        upload: async (file) => {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('siteId', siteId);
          const out = await uploadMedia(fd);
          return { url: out.publicUrl };
        },
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Brand, contact, hours, and social profiles.</p>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {pending ? 'Saving…' : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : null}
          <Button
            onClick={() =>
              start(async () => {
                await saveSiteSettings(siteId, value);
                setSavedAt(new Date());
              })
            }
          >
            Save
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <FormFromSchema meta={meta} value={value} onChange={setValue} />
      </div>
    </EditorProvider>
  );
}
