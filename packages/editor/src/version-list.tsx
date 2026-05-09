'use client';

import { Eye, RotateCcw } from 'lucide-react';
import { Button } from '@tarheel/ui';

export interface PageVersion {
  id: string;
  reason: string | null;
  created_at: string;
  edited_by: string | null;
}

interface Props {
  versions: PageVersion[];
  onRestore: (id: string) => Promise<void> | void;
  /** Optional — when provided, each row also gets a Preview button that
   *  loads the snapshot into the iframe without committing it as the
   *  current draft. */
  onPreview?: (id: string) => Promise<void> | void;
  /** ID of the version currently being previewed, if any — receives
   *  a "Previewing" highlight. */
  previewingId?: string | null;
}

export function VersionList({ versions, onRestore, onPreview, previewingId }: Props) {
  if (versions.length === 0) {
    return <p className="text-sm text-slate-500">No saved versions yet.</p>;
  }
  return (
    <ul className="divide-y divide-slate-200">
      {versions.map((v) => {
        const previewing = previewingId === v.id;
        return (
          <li
            key={v.id}
            className={`flex items-center justify-between gap-2 py-3 transition-colors duration-[var(--dur-fast)] ${
              previewing ? 'bg-amber-50/60' : ''
            }`}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-900">{v.reason ?? 'snapshot'}</div>
              <div className="text-xs text-slate-500">{new Date(v.created_at).toLocaleString()}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {onPreview ? (
                <Button
                  size="sm"
                  variant={previewing ? 'default' : 'ghost'}
                  onClick={() => void onPreview(v.id)}
                  title="Show this version in the preview pane (doesn't change the draft)"
                >
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  {previewing ? 'Previewing' : 'Preview'}
                </Button>
              ) : null}
              <Button size="sm" variant="outline" onClick={() => void onRestore(v.id)} title="Replace the current draft with this version">
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Restore
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
