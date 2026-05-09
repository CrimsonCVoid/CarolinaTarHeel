'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { Button } from '@tarheel/ui';
import {
  AutosaveIndicator,
  EditorProvider,
  FormFromSchema,
  PreviewIframe,
  VersionList,
  type AutosaveStatus,
  type PageVersion,
} from '@tarheel/editor';
import type { FieldMeta } from '@tarheel/templates';
import { saveDraft, publishPage, restoreVersion, uploadMedia, getVersionContent } from './actions';
import { PublishCelebration, type PublishStage } from '@/components/publish-celebration';

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
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const [publishStage, setPublishStage] = useState<PublishStage>('idle');
  const [previewingVersionId, setPreviewingVersionId] = useState<string | null>(null);

  /*
   * Live preview channel. Holds a ref to the iframe element and a flag
   * that flips true when the iframe's PreviewSurface emits 'thw-preview-
   * ready'. Once ready, every form change is forwarded immediately. The
   * iframe re-renders client-side without a DB roundtrip — typing feels
   * synchronous. DB autosave still runs on the 1.5s debounce in parallel.
   */
  const iframeReadyRef = useRef(false);
  const lastDraftRef = useRef(draft);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'thw-preview-ready') {
        iframeReadyRef.current = true;
        // Push current draft so the iframe matches the editor state on
        // mount even if the user typed during navigation/hydration.
        postPreview(lastDraftRef.current);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function postPreview(content: Record<string, unknown>) {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe[data-thw-preview]');
    if (!iframe?.contentWindow) return;
    try {
      iframe.contentWindow.postMessage({ type: 'thw-preview-content', content }, '*');
    } catch {
      // ignore
    }
  }

  const handleAutosave = useCallback(
    (next: Record<string, unknown>) => {
      setStatus('saving');
      startTransition(async () => {
        try {
          await saveDraft(siteId, slug, next);
          setSavedAt(new Date());
          setStatus('saved');
          setRefreshKey((k) => k + 1);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Save failed');
          setStatus('error');
        }
      });
    },
    [siteId, slug],
  );

  // Mirror form-level changes:
  //   - update local draft state (drives the form re-render)
  //   - flip the autosave indicator to 'editing' immediately
  //   - postMessage the draft to the preview iframe so it re-renders now,
  //     long before the 1.5s autosave fires
  const handleDraftChange = useCallback((next: Record<string, unknown>) => {
    setDraft(next);
    lastDraftRef.current = next;
    setStatus((s) => (s === 'saving' ? s : 'editing'));
    // Typing while previewing a snapshot exits the snapshot — the live
    // draft takes over the iframe immediately.
    setPreviewingVersionId(null);
    if (iframeReadyRef.current) postPreview(next);
  }, []);

  const handlePublish = () => {
    setStatus('saving');
    setError(null);
    setPublishStage('saving');
    startTransition(async () => {
      try {
        // Stage progression is mostly cosmetic — publishPage runs in one
        // server action, but we tick through 'updating' and 'verifying'
        // so the user sees the live update + revalidation steps land in
        // sequence. Total wall time ~1-2s for a normal publish.
        const promise = publishPage(siteId, slug);
        const t1 = setTimeout(() => setPublishStage('updating'), 300);
        const t2 = setTimeout(() => setPublishStage('verifying'), 900);
        await promise;
        clearTimeout(t1);
        clearTimeout(t2);
        setSavedAt(new Date());
        setStatus('saved');
        setPublishStage('done');
        setTimeout(() => setPublishStage('idle'), 4500);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Publish failed');
        setStatus('error');
        setPublishStage('error');
      }
    });
  };

  const handleRestore = async (versionId: string) => {
    await restoreVersion(siteId, slug, versionId);
    window.location.reload();
  };

  // Show a snapshot in the iframe without committing it as the current
  // draft. Pushes the version content over the same postMessage channel
  // the live preview uses. User can then either Restore (to commit) or
  // Exit preview (to revert the iframe to the in-memory draft).
  const handlePreviewVersion = async (versionId: string) => {
    if (previewingVersionId === versionId) {
      // Toggle off — go back to current draft
      setPreviewingVersionId(null);
      postPreview(lastDraftRef.current);
      return;
    }
    try {
      const content = (await getVersionContent(siteId, versionId)) as Record<string, unknown>;
      setPreviewingVersionId(versionId);
      postPreview(content);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load version');
    }
  };

  const exitVersionPreview = () => {
    setPreviewingVersionId(null);
    postPreview(lastDraftRef.current);
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
      {/*
        Split-pane app shell — exactly viewport-height. Sidebar lives to
        the left (in the portal layout) so this column has no top chrome
        of its own. Left pane scrolls the form independently; right pane
        iframe fills the column.
      */}
      <div className="grid h-screen grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col overflow-y-auto border-slate-200 px-6 py-6 lg:border-r">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-semibold tracking-tight text-slate-900">
                {pageTitle}
              </h2>
              <p className="truncate text-xs text-slate-500">{slug}</p>
            </div>
            <div className="flex items-center gap-3">
              <AutosaveIndicator status={status} savedAt={savedAt} errorMessage={error ?? undefined} />
              <Button onClick={handlePublish} disabled={isPending}>
                Publish
              </Button>
            </div>
          </div>
          {error ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
          ) : null}
          <FormFromSchema meta={editorMeta} value={draft} onChange={handleDraftChange} onAutosave={handleAutosave} />
          <details className="mt-6 rounded-2xl border border-slate-200 bg-white">
            <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-slate-900">
              Version history
            </summary>
            <div className="border-t border-slate-200 px-5 py-4">
              <VersionList
                versions={versions}
                onRestore={handleRestore}
                onPreview={handlePreviewVersion}
                previewingId={previewingVersionId}
              />
            </div>
          </details>
        </div>
        <div className="relative flex min-h-0 flex-col bg-slate-100 p-4">
          {previewingVersionId ? (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
              <span>
                <strong>Previewing a snapshot.</strong> Your draft is unchanged.
              </span>
              <button
                type="button"
                onClick={exitVersionPreview}
                className="text-xs font-medium text-amber-900 underline-offset-2 hover:underline"
              >
                Exit preview
              </button>
            </div>
          ) : null}
          <div className="min-h-0 flex-1">
            <PreviewIframe src={previewUrl} refreshKey={refreshKey} />
          </div>
        </div>
      </div>
      <PublishCelebration
        stage={publishStage}
        liveUrl={_siteDomain}
        errorMessage={error ?? undefined}
        onDismiss={() => setPublishStage('idle')}
      />
    </EditorProvider>
  );
}
