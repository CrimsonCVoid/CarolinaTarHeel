'use client';

import { useEffect, useState } from 'react';
import { renderTemplateUnsafe, type SiteSettings } from '@tarheel/templates';

interface Props {
  templateId: string;
  slug: string;
  initialContent: unknown;
  initialSettings: SiteSettings;
}

/*
 * Live preview surface.
 *
 * Renders the template client-side from React state so the editor can
 * push the latest draft over postMessage and the iframe re-renders
 * immediately — no DB roundtrip, no router.refresh(), no autosave wait.
 *
 * Initial state comes from the server (page.draft_content) so the
 * iframe SSRs cleanly with the persisted draft. After hydration, the
 * editor parent posts every change as it happens; we update local
 * state and React reconciles the template tree in place.
 *
 * Validation is intentionally skipped here (renderTemplateUnsafe). Mid-
 * edit drafts can be partially invalid (half-typed URLs, fields not
 * yet filled) — the live preview should still show whatever the user
 * has so far. The publish gate stays strict and rejects invalid data
 * before it reaches the live site.
 */
export function PreviewSurface({ templateId, slug, initialContent, initialSettings }: Props) {
  const [content, setContent] = useState<unknown>(initialContent);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data as { type?: string; content?: unknown; settings?: SiteSettings } | null;
      if (!data || data.type !== 'thw-preview-content') return;
      if ('content' in data && data.content !== undefined) setContent(data.content);
      if ('settings' in data && data.settings !== undefined) setSettings(data.settings);
    }
    window.addEventListener('message', onMessage);
    // Tell the parent we're ready — lets it skip the initial postMessage if
    // the SSR'd state is already current.
    try {
      window.parent?.postMessage({ type: 'thw-preview-ready' }, '*');
    } catch {
      // ignore
    }
    return () => window.removeEventListener('message', onMessage);
  }, []);

  try {
    return renderTemplateUnsafe(templateId, slug, content, settings);
  } catch {
    // Last-ditch: the component itself crashed on a malformed draft.
    // Render nothing rather than blank-white the iframe — the editor
    // will overwrite this on the next message.
    return null;
  }
}
