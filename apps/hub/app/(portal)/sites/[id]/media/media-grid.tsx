'use client';

import { useRef, useState, useTransition } from 'react';
import { Button, Card, CardContent, Input, Label, Textarea } from '@tarheel/ui';
import { Trash2, Upload } from 'lucide-react';
import { uploadMediaItems, updateAltText, deleteMedia } from './actions';
import { EmptyFrameIllustration } from '@/components/illustrations';

interface MediaItem {
  id: string;
  public_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
  storage_path: string;
}

export function MediaGrid({ siteId, initial }: { siteId: string; initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  const [active, setActive] = useState<MediaItem | null>(null);
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  async function handleFiles(files: FileList | File[]) {
    const fd = new FormData();
    fd.append('siteId', siteId);
    for (const f of Array.from(files)) fd.append('files', f);
    start(async () => {
      const out = await uploadMediaItems(fd);
      setItems((prev) => [...out, ...prev]);
    });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">Media</h1>
          <p className="text-sm text-slate-600">{items.length} file{items.length === 1 ? '' : 's'}</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} disabled={pending}>
          <Upload className="mr-2 h-4 w-4" /> {pending ? 'Uploading…' : 'Upload'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length > 0) void handleFiles(e.dataTransfer.files);
        }}
        className={`mt-6 rounded-2xl border-2 border-dashed p-2 ${drag ? 'border-brand-400 bg-brand-50' : 'border-slate-200'}`}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <EmptyFrameIllustration className="mb-5 h-16 w-16" />
            <p className="text-base font-medium text-slate-900">Drag a photo here, or click Upload.</p>
            <p className="mt-1 text-xs text-slate-500">JPG / PNG / WebP. Alt text required before publish.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActive(m)}
                  className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.public_url} alt={m.alt_text ?? ''} className="h-full w-full object-cover" loading="lazy" />
                  {!m.alt_text ? (
                    <span className="absolute bottom-1 right-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Missing alt
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
          onClick={() => setActive(null)}
        >
          <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.public_url} alt={active.alt_text ?? ''} className="h-72 w-full rounded-xl object-cover" />
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="alt">Alt text (required)</Label>
                  <Textarea
                    id="alt"
                    rows={2}
                    defaultValue={active.alt_text ?? ''}
                    onBlur={(e) => {
                      start(async () => {
                        await updateAltText(active.id, e.target.value);
                        setItems((prev) => prev.map((x) => (x.id === active.id ? { ...x, alt_text: e.target.value } : x)));
                      });
                    }}
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input readOnly value={active.public_url} />
                </div>
                <div className="flex justify-between gap-3 pt-2">
                  <Button
                    variant="danger"
                    onClick={async () => {
                      if (!confirm('Delete this image?')) return;
                      await deleteMedia(active.id, siteId);
                      setItems((prev) => prev.filter((x) => x.id !== active.id));
                      setActive(null);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                  <Button variant="outline" onClick={() => setActive(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
