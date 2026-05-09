'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { PortalSidebar } from './sidebar';

interface SiteEntry {
  id: string;
  domain: string;
  status: 'draft' | 'live' | 'archived';
  org: { name: string | null; plan?: string | null } | null;
}

interface Props {
  email: string;
  isOperator: boolean;
  sites: SiteEntry[];
  submissionsBySite: Record<string, number>;
  children: ReactNode;
}

/*
 * Client wrapper that derives `activeSiteId` from the URL and passes the
 * resolved badge count down. Layout uses this to keep all server queries
 * in the (portal) layout while the sidebar UI stays a client component
 * that reacts to client-side route changes.
 */
export function PortalShell({ email, isOperator, sites, submissionsBySite, children }: Props) {
  const pathname = usePathname();
  const activeSiteId = parseSiteId(pathname);
  const newSubmissions = activeSiteId ? (submissionsBySite[activeSiteId] ?? 0) : 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <PortalSidebar
        email={email}
        isOperator={isOperator}
        activeSiteId={activeSiteId}
        sites={sites}
        newSubmissions={newSubmissions}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function parseSiteId(pathname: string | null): string | null {
  if (!pathname) return null;
  const m = pathname.match(/^\/sites\/([0-9a-f-]{36})/i);
  return m ? (m[1] ?? null) : null;
}
