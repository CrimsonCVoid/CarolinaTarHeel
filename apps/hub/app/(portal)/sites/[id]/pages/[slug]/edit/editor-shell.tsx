'use client';

import { useCallback, useState, useTransition } from 'react';
import { Button } from '@tarheel/ui';
import { EditorProvider, FormFromSchema, PreviewIframe, VersionList, type PageVersion } from '@tarheel/editor';
import type { FieldMeta } from '@tarheel/templates';
import { saveDraft, publishPage, restoreVersion, uploadMedia } from './actions';

interface Props {
  siteId: string;
  siteDomain: string;
  slug: string;
  pageTitle: string;
  templateId: string;
  editorMeta: Record<string, FieldMeta>;
  initialDraft: Record<string, unknown>;
  previewUrl: string;
  versions: PageVersion[];
}

export function EditorShell({
  siteId,
  siteDomain: _siteDomain,
  slug,
  pageTitle,
  templateId: _templateId,
  editorMeta,
  initialDraft,
  previewUrl,
  versions,
}: Props) {
  const [draft, setDraft] = useState(initialDraft);
  const [refreshKey, setRefreshKey] = useState(0);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAutosave = useCallback(
    (next: Record<string, unknown>) => {
      startTransition(async () => {
        try {
          await saveDraft(siteId, slug, next);
          setSavedAt(new Date());
          setRefreshKey((k) => k + 1);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Save failed');
        }
      });
    },
    [siteId, slug],
  );

  const handlePublish = () => {
    startTransition(async () => {
      try {
        setError(null);
        await publishPage(siteId, slug);
        setSavedAt(new Date());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Publish failed');
      }
    });
  };

  const handleRestore = async (versionId: string) => {
    await restoreVersion(siteId, slug, versionId);
    window.location.reload();
  };

  const upload = useCallback(
    async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('siteId', siteId);
      const res = await uploadMedia(fd);
      return { url: res.publicUrl, width: res.width, height: res.height };
    },
    [siteId],
  );

  return (
    <EditorProvider value={{ siteId, upload }}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-semibold tracking-tight text-slate-900">
                {pageTitle}
              </h2>
              <p className="truncate text-xs text-slate-500">{slug}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {isPending ? 'Saving…' : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : 'Not saved'}
              <Button onClick={handlePublish} disabled={isPending}>
                Publish
              </Button>
            </div>
          </div>
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
          ) : null}
          <FormFromSchema
            meta={editorMeta}
            value={draft}
            onChange={setDraft}
            onAutosave={handleAutosave}
          />
          <details className="rounded-2xl border border-slate-200 bg-white">
            <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-slate-900">
              Version history
            </summary>
            <div className="border-t border-slate-200 px-5 py-4">
              <VersionList versions={versions} onRestore={handleRestore} />
            </div>
          </details>
        </div>
        <div className="lg:sticky lg:top-6 lg:self-start">
          <PreviewIframe src={previewUrl} refreshKey={refreshKey} />
        </div>
      </div>
    </EditorProvider>
  );
}
