'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Home,
  FileText,
  Image as ImageIcon,
  Inbox,
  Settings,
  Users,
  CreditCard,
  History,
  Shield,
  ChevronDown,
  Check,
  ExternalLink,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Badge, cn } from '@tarheel/ui';
import { createBrowserClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

interface SiteListEntry {
  id: string;
  domain: string;
  status: 'draft' | 'live' | 'archived';
  org: { name: string | null } | null;
}

interface Props {
  email: string;
  isOperator: boolean;
  activeSiteId: string | null;
  sites: SiteListEntry[];
  /** Number of new (unread) form submissions for the active site, for the
   *  Forms nav badge. Computed server-side. */
  newSubmissions: number;
}

/*
 * Single sidebar shell for the entire portal. Replaces the previous
 * portal-header-plus-site-tabs layout. Optimized for the common case
 * where a client has exactly one site — the sidebar is permanently
 * scoped to "their site" and the site switcher is hidden. When a user
 * is an operator (or owns multiple orgs) the switcher appears at the top.
 */
export function PortalSidebar({ email, isOperator, activeSiteId, sites, newSubmissions }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const activeSite = sites.find((s) => s.id === activeSiteId) ?? null;
  const showSwitcher = sites.length > 1;

  const baseNav: Array<{ href: string; label: string; icon: typeof Home; badge?: number }> = activeSite
    ? [
        { href: `/sites/${activeSite.id}`, label: 'Overview', icon: Home },
        { href: `/sites/${activeSite.id}/pages`, label: 'Pages', icon: FileText },
        { href: `/sites/${activeSite.id}/media`, label: 'Media', icon: ImageIcon },
        { href: `/sites/${activeSite.id}/forms`, label: 'Inbox', icon: Inbox, badge: newSubmissions },
        { href: `/sites/${activeSite.id}/settings`, label: 'Settings', icon: Settings },
      ]
    : [];

  const teamNav: Array<{ href: string; label: string; icon: typeof Home }> = activeSite
    ? [
        { href: `/sites/${activeSite.id}/team`, label: 'Team', icon: Users },
        { href: `/sites/${activeSite.id}/billing`, label: 'Billing', icon: CreditCard },
        { href: `/sites/${activeSite.id}/history`, label: 'Activity', icon: History },
      ]
    : [];

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-[var(--dur-base)] ease-[var(--ease-out-quint)]',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Brand row */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-900 hover:text-brand-700"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <span className="font-display text-xs font-bold">T</span>
          </span>
          {!collapsed && <span className="truncate font-display tracking-tight">Tar Heel Web Co.</span>}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="hidden rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 md:block"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Site context */}
      {activeSite && !collapsed ? (
        <div className="border-b border-slate-200 p-3">
          <button
            type="button"
            onClick={() => showSwitcher && setSwitcherOpen((o) => !o)}
            className={cn(
              'group flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition-colors',
              showSwitcher && 'hover:border-slate-300 hover:bg-slate-100',
            )}
            aria-haspopup={showSwitcher ? 'listbox' : undefined}
            aria-expanded={showSwitcher ? switcherOpen : undefined}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    'inline-block h-1.5 w-1.5 rounded-full',
                    activeSite.status === 'live'
                      ? 'bg-emerald-500'
                      : activeSite.status === 'draft'
                        ? 'bg-amber-500'
                        : 'bg-slate-400',
                  )}
                />
                <span className="truncate text-sm font-semibold text-slate-900">
                  {activeSite.org?.name ?? activeSite.domain}
                </span>
              </div>
              <div className="mt-0.5 truncate text-xs text-slate-500">{activeSite.domain}</div>
            </div>
            {showSwitcher && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-slate-400 transition-transform',
                  switcherOpen && 'rotate-180',
                )}
              />
            )}
          </button>

          {showSwitcher && switcherOpen ? (
            <ul
              role="listbox"
              className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-sm"
            >
              {sites.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/sites/${s.id}`}
                    onClick={() => setSwitcherOpen(false)}
                    className={cn(
                      'flex items-center justify-between gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50',
                      s.id === activeSite.id && 'bg-slate-50 text-slate-900',
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{s.org?.name ?? s.domain}</span>
                      <span className="block truncate text-xs text-slate-500">{s.domain}</span>
                    </span>
                    {s.id === activeSite.id ? <Check className="h-4 w-4 text-brand-600" /> : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <a
            href={`https://${activeSite.domain}`}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-flex items-center gap-1 text-xs text-brand-700 underline-offset-2 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View live site
          </a>
        </div>
      ) : null}

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <SectionLabel collapsed={collapsed}>Manage</SectionLabel>
        <ul className="mt-1 space-y-0.5">
          {baseNav.map((n) => (
            <NavItem key={n.href} {...n} collapsed={collapsed} active={isActive(pathname, n.href)} />
          ))}
        </ul>

        {teamNav.length > 0 ? (
          <>
            <SectionLabel collapsed={collapsed} className="mt-6">
              Account
            </SectionLabel>
            <ul className="mt-1 space-y-0.5">
              {teamNav.map((n) => (
                <NavItem key={n.href} {...n} collapsed={collapsed} active={isActive(pathname, n.href)} />
              ))}
            </ul>
          </>
        ) : null}

        {isOperator ? (
          <>
            <SectionLabel collapsed={collapsed} className="mt-6">
              Operator
            </SectionLabel>
            <ul className="mt-1 space-y-0.5">
              <NavItem
                href="/admin"
                label="All organizations"
                icon={Shield}
                collapsed={collapsed}
                active={pathname === '/admin' || pathname?.startsWith('/admin/orgs')}
              />
              <NavItem
                href="/admin/onboard"
                label="Onboard client"
                icon={Users}
                collapsed={collapsed}
                active={pathname === '/admin/onboard'}
              />
            </ul>
          </>
        ) : null}
      </nav>

      {/* Footer / user */}
      <div className="border-t border-slate-200 p-3">
        {!collapsed ? (
          <>
            <div className="truncate text-xs text-slate-500">{email}</div>
            <LogoutButton />
          </>
        ) : (
          <CollapsedLogout />
        )}
      </div>
    </aside>
  );
}

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === pathname) return true;
  // For overview links like /sites/[id], avoid lighting up on every nested route
  const segments = href.split('/').length;
  return segments >= 4 && pathname.startsWith(href + '/');
}

function SectionLabel({
  children,
  collapsed,
  className,
}: {
  children: React.ReactNode;
  collapsed: boolean;
  className?: string;
}) {
  if (collapsed) return null;
  return (
    <div className={cn('px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400', className)}>
      {children}
    </div>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  badge,
  collapsed,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  badge?: number;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        title={collapsed ? label : undefined}
        className={cn(
          'group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-[var(--dur-fast)]',
          active
            ? 'bg-brand-50 text-brand-800'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
        )}
      >
        {active ? (
          <span aria-hidden className="absolute left-0 top-1.5 h-5 w-0.5 rounded-r bg-brand-600" />
        ) : null}
        <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-brand-700' : 'text-slate-400')} />
        {!collapsed && <span className="flex-1 truncate">{label}</span>}
        {!collapsed && badge !== undefined && badge > 0 ? (
          <Badge variant="warning" className="px-1.5 py-0">
            {badge}
          </Badge>
        ) : null}
      </Link>
    </li>
  );
}

function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = createBrowserClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
      }}
      className="mt-2 inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <LogOut className="h-3.5 w-3.5" />
      Log out
    </button>
  );
}

function CollapsedLogout() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = createBrowserClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
      }}
      title="Log out"
      className="flex h-10 w-full items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
      aria-label="Log out"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
