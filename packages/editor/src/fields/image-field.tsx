'use client';

import { useRef, useState } from 'react';
import { Button, Input, Label } from '@tarheel/ui';
import { useEditor } from '../context';
import type { FieldComponentProps } from '../types';

export function ImageField({ name, meta, value, onChange, error }: FieldComponentProps) {
  const editor = useEditor();
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const url = typeof value === 'string' ? value : '';

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const out = await editor.upload(file);
      onChange(out.url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Label htmlFor={name}>
        {meta.label}
        {meta.required ? <span className="text-red-600"> *</span> : null}
      </Label>
      {meta.help ? <p className="mt-0.5 text-xs text-slate-500">{meta.help}</p> : null}
      <div className="mt-1.5 flex items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-16 w-16 rounded-md border border-slate-200 object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400">
            none
          </div>
        )}
        <div className="flex-1 space-y-2">
          <Input
            value={url}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => ref.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
            {url ? (
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange('')}>
                Clear
              </Button>
            ) : null}
          </div>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = '';
            }}
          />
          {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
