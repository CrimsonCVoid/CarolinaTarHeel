'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Badge, Button } from '@tarheel/ui';
import { setStatus, exportCsv } from './actions';

interface Submission {
  id: string;
  form_id: string;
  data: unknown;
  status: 'new' | 'read' | 'archived' | 'spam';
  created_at: string;
}

const STATUSES: Array<Submission['status']> = ['new', 'read', 'archived', 'spam'];

export function FormsInbox({
  siteId,
  initial,
  activeStatus,
  activeForm,
}: {
  siteId: string;
  initial: Submission[];
  activeStatus?: string;
  activeForm?: string;
}) {
  const [items, setItems] = useState(initial);
  const [active, setActive] = useState<Submission | null>(null);
  const [pending, start] = useTransition();

  const formIds = Array.from(new Set(initial.map((s) => s.form_id)));

  function update(id: string, status: Submission['status']) {
    start(async () => {
      await setStatus(id, status, siteId);
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      if (active?.id === id) setActive({ ...active, status });
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Status:</span>
          <Link href={`/sites/${siteId}/forms`} className={!activeStatus ? 'font-semibold text-brand-700' : 'text-slate-600 hover:text-brand-700'}>
            All
          </Link>
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/sites/${siteId}/forms?status=${s}`}
              className={activeStatus === s ? 'font-semibold text-brand-700' : 'text-slate-600 hover:text-brand-700'}
            >
              {s}
            </Link>
          ))}
          {formIds.length > 1 ? (
            <>
              <span className="ml-3 text-slate-500">Form:</span>
              {formIds.map((f) => (
                <Link
                  key={f}
                  href={`/sites/${siteId}/forms?form=${f}`}
                  className={activeForm === f ? 'font-semibold text-brand-700' : 'text-slate-600 hover:text-brand-700'}
                >
                  {f}
                </Link>
              ))}
            </>
          ) : null}
        </div>
        <form action={exportCsv}>
          <input type="hidden" name="siteId" value={siteId} />
          {activeForm ? <input type="hidden" name="formId" value={activeForm} /> : null}
          <Button type="submit" variant="outline" size="sm">
            Export CSV
          </Button>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-slate-500">No submissions yet.</p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {items.map((s) => {
            const data = (s.data as Record<string, unknown>) ?? {};
            const previewKey = Object.keys(data).find((k) => typeof data[k] === 'string');
            return (
              <li key={s.id} className="px-6 py-4">
                <button onClick={() => setActive(s)} className="grid w-full grid-cols-[80px_1fr_auto] gap-4 text-left">
                  <Badge variant={s.status === 'new' ? 'warning' : s.status === 'archived' ? 'muted' : s.status === 'spam' ? 'danger' : 'default'}>
                    {s.status}
                  </Badge>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{s.form_id}</div>
                    {previewKey ? (
                      <div className="line-clamp-1 text-sm text-slate-600">
                        {String(data[previewKey])}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-xs text-slate-500">{new Date(s.created_at).toLocaleString()}</div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {active ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 sm:place-items-center">
          <div className="w-full max-w-xl rounded-t-2xl bg-white p-6 sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{active.form_id}</h2>
                <p className="text-xs text-slate-500">{new Date(active.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setActive(null)} className="text-sm text-slate-500 hover:text-slate-900">
                ✕
              </button>
            </div>
            <dl className="mt-6 divide-y divide-slate-200 text-sm">
              {Object.entries((active.data as Record<string, unknown>) ?? {}).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[140px_1fr] gap-4 py-2">
                  <dt className="font-medium text-slate-700">{k}</dt>
                  <dd className="text-slate-900">{typeof v === 'string' ? v : JSON.stringify(v)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {STATUSES.map((s) => (
                <Button
                  key={s}
                  variant={active.status === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update(active.id, s)}
                  disabled={pending}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
