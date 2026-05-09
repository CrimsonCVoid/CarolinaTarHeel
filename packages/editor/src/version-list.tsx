'use client';

import { Button } from '@tarheel/ui';

export interface PageVersion {
  id: string;
  reason: string | null;
  created_at: string;
  edited_by: string | null;
}

export function VersionList({
  versions,
  onRestore,
}: {
  versions: PageVersion[];
  onRestore: (id: string) => Promise<void> | void;
}) {
  if (versions.length === 0) {
    return <p className="text-sm text-slate-500">No saved versions yet.</p>;
  }
  return (
    <ul className="divide-y divide-slate-200">
      {versions.map((v) => (
        <li key={v.id} className="flex items-center justify-between py-3">
          <div>
            <div className="text-sm font-medium text-slate-900">{v.reason ?? 'snapshot'}</div>
            <div className="text-xs text-slate-500">{new Date(v.created_at).toLocaleString()}</div>
          </div>
          <Button size="sm" variant="outline" onClick={() => void onRestore(v.id)}>
            Restore
          </Button>
        </li>
      ))}
    </ul>
  );
}
