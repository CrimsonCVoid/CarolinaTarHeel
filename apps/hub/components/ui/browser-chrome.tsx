import type { ReactNode } from 'react';

interface Props {
  url: string;
  /** Right-aligned label, e.g. "Built by Tar Heel Web" */
  label?: string;
  children: ReactNode;
  className?: string;
}

/*
 * Mock browser chrome (titlebar + address bar) wrapping arbitrary content.
 * Used by §1 hero demo and the §3 race panels. Kept as a server component
 * — pure structural markup, no client JS.
 */
export function BrowserChrome({ url, label, children, className }: Props) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className ?? ''}`}>
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="rounded bg-white px-2.5 py-1 text-center text-xs text-slate-500">{url}</div>
        </div>
        {label ? (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
        ) : null}
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}
