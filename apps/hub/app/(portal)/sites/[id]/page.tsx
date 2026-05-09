import Link from 'next/link';
import { Edit3, ExternalLink, Image as ImageIcon, Inbox, Rocket, Clock, ArrowRight } from 'lucide-react';
import { Badge, Card, CardContent, Container } from '@tarheel/ui';
import { getTemplate } from '@tarheel/templates';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { signPreviewToken } from '@/lib/preview-token';

export const metadata = { title: 'Overview' };

interface PageRow {
  id: string;
  slug: string;
  status: 'draft' | 'published';
  updated_at: string;
}

interface SubmissionRow {
  id: string;
  form_id: string;
  data: unknown;
  status: 'new' | 'read' | 'archived' | 'spam';
  created_at: string;
}

interface AuditRow {
  action: string;
  metadata: unknown;
  created_at: string;
}

export default async function SiteOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site } = await requireSiteAccess(id);
  const template = getTemplate(site.template_id);
  const supabase = await createServerClient();

  const [pagesQ, submissionsQ, newSubsQ, auditQ, mediaQ, settingsQ] = await Promise.all([
    supabase.from('pages').select('id, slug, status, updated_at').eq('site_id', id).order('slug'),
    supabase
      .from('form_submissions')
      .select('id, form_id, data, status, created_at')
      .eq('site_id', id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('form_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('site_id', id)
      .eq('status', 'new'),
    supabase
      .from('audit_log')
      .select('action, metadata, created_at')
      .eq('site_id', id)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('media').select('id', { count: 'exact', head: true }).eq('site_id', id),
    supabase.from('site_settings').select('brand').eq('site_id', id).maybeSingle(),
  ]);

  const pages = (pagesQ.data ?? []) as PageRow[];
  const recentSubmissions = (submissionsQ.data ?? []) as SubmissionRow[];
  const newSubmissionCount = newSubsQ.count ?? 0;
  const auditEvents = (auditQ.data ?? []) as AuditRow[];
  const mediaCount = mediaQ.count ?? 0;
  const brandName = (settingsQ.data?.brand as { name?: string } | null)?.name;

  const previewToken = signPreviewToken(site.id, site.preview_secret);
  const previewUrl = `/preview/${site.id}?token=${previewToken}`;

  const mostRecentEdit = pages
    .map((p) => p.updated_at)
    .sort()
    .at(-1);

  return (
    <Container className="py-10">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
            {brandName ?? site.domain}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <Badge variant={site.status === 'live' ? 'success' : site.status === 'draft' ? 'warning' : 'muted'}>
              {site.status}
            </Badge>
            <span>{site.domain}</span>
            <span className="text-slate-300">·</span>
            <span>{template.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`https://${site.domain}`}
            target="_blank"
            rel="noopener"
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition-colors duration-[var(--dur-fast)] hover:bg-slate-50 active:scale-[0.97] motion-reduce:active:scale-100"
          >
            <ExternalLink className="h-4 w-4" />
            View live
          </a>
          <Link
            href={`/sites/${id}/pages/${encodeURIComponent('/')}/edit`}
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-brand-600 px-4 text-sm font-medium text-white transition-colors duration-[var(--dur-fast)] hover:bg-brand-700 active:scale-[0.97] motion-reduce:active:scale-100"
          >
            <Edit3 className="h-4 w-4" />
            Edit homepage
          </Link>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
            <span>Live preview · {site.domain}</span>
            <Link href={previewUrl} target="_blank" className="text-brand-700 hover:underline">
              Open in new tab ↗
            </Link>
          </div>
          <iframe src={previewUrl} title="Site preview" className="block h-[420px] w-full bg-white" />
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <StatTile
            href={`/sites/${id}/forms`}
            icon={Inbox}
            label="New submissions"
            value={newSubmissionCount}
            tone={newSubmissionCount > 0 ? 'warn' : 'neutral'}
          />
          <StatTile
            href={`/sites/${id}/pages`}
            icon={Edit3}
            label="Pages"
            value={pages.length}
            tone="neutral"
          />
          <StatTile
            href={`/sites/${id}/media`}
            icon={ImageIcon}
            label="Media"
            value={mediaCount}
            tone="neutral"
          />
          <StatTile
            href={`/sites/${id}/history`}
            icon={Clock}
            label="Last edit"
            valueText={mostRecentEdit ? relativeTime(mostRecentEdit) : '—'}
            tone="neutral"
          />
        </div>
      </div>

      <Card className="mt-8">
        <CardContent>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              href={`/sites/${id}/pages/${encodeURIComponent('/')}/edit`}
              icon={Edit3}
              label="Edit homepage"
              hint="Hero, intro, CTAs"
            />
            <QuickAction
              href={`/sites/${id}/media`}
              icon={ImageIcon}
              label="Upload photo"
              hint="JPG / PNG / WebP"
            />
            <QuickAction
              href={`/sites/${id}/settings`}
              icon={Rocket}
              label="Update info"
              hint="Hours, contact, brand"
            />
            <QuickAction
              href={`/sites/${id}/forms`}
              icon={Inbox}
              label="View inbox"
              hint={
                newSubmissionCount > 0
                  ? `${newSubmissionCount} new ${newSubmissionCount === 1 ? 'message' : 'messages'}`
                  : 'No new messages'
              }
              accent={newSubmissionCount > 0}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Pages</h2>
              <Link href={`/sites/${id}/pages`} className="text-xs text-brand-700 hover:underline">
                Manage all →
              </Link>
            </div>
            <ul className="divide-y divide-slate-200">
              {template.pages.slice(0, 5).map((p) => {
                const row = pages.find((r) => r.slug === p.slug);
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/sites/${id}/pages/${encodeURIComponent(p.slug)}/edit`}
                      className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900">{p.title}</div>
                        <div className="text-xs text-slate-500">
                          {p.slug}
                          {row?.updated_at ? <> · updated {relativeTime(row.updated_at)}</> : ' · not yet edited'}
                        </div>
                      </div>
                      <Badge variant={row?.status === 'published' ? 'success' : 'warning'}>
                        {row?.status ?? 'new'}
                      </Badge>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Recent activity</h2>
              <Link href={`/sites/${id}/history`} className="text-xs text-brand-700 hover:underline">
                See all →
              </Link>
            </div>
            {auditEvents.length === 0 && recentSubmissions.length === 0 ? (
              <p className="py-6 text-sm text-slate-500">No activity yet. Make an edit to get started.</p>
            ) : (
              <ul className="space-y-3">
                {auditEvents.slice(0, 4).map((e, i) => (
                  <li key={`a-${i}`} className="flex items-start gap-3 text-sm">
                    <Rocket className="mt-0.5 h-4 w-4 text-brand-600" />
                    <div className="min-w-0 flex-1">
                      <div className="text-slate-900">{prettyAction(e.action, e.metadata)}</div>
                      <div className="text-xs text-slate-500">{relativeTime(e.created_at)}</div>
                    </div>
                  </li>
                ))}
                {recentSubmissions.slice(0, 2).map((s) => (
                  <li key={s.id} className="flex items-start gap-3 text-sm">
                    <Inbox className="mt-0.5 h-4 w-4 text-amber-600" />
                    <div className="min-w-0 flex-1">
                      <div className="text-slate-900">
                        {previewSubmission(s.data)} <span className="text-slate-500">via {s.form_id}</span>
                      </div>
                      <div className="text-xs text-slate-500">{relativeTime(s.created_at)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

function StatTile({
  href,
  icon: Icon,
  label,
  value,
  valueText,
  tone,
}: {
  href: string;
  icon: typeof Edit3;
  label: string;
  value?: number;
  valueText?: string;
  tone: 'warn' | 'neutral';
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-[border-color,transform] duration-[var(--dur-fast)] hover:-translate-y-0.5 hover:border-brand-300 motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-start justify-between">
        <Icon className={`h-4 w-4 ${tone === 'warn' ? 'text-amber-600' : 'text-slate-400'}`} aria-hidden />
        <ArrowRight className="h-3 w-3 text-slate-300 transition-colors group-hover:text-brand-600" />
      </div>
      <div className="mt-3">
        <div className={`font-display text-2xl font-semibold ${tone === 'warn' ? 'text-amber-700' : 'text-slate-900'}`}>
          {valueText ?? value}
        </div>
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  hint,
  accent,
}: {
  href: string;
  icon: typeof Edit3;
  label: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl border p-4 transition-colors duration-[var(--dur-fast)] ${
        accent
          ? 'border-amber-200 bg-amber-50 hover:border-amber-300 hover:bg-amber-100'
          : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          accent ? 'bg-amber-200/70 text-amber-800' : 'bg-brand-100 text-brand-700'
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-slate-900">{label}</span>
        <span className="block truncate text-xs text-slate-500">{hint}</span>
      </span>
      <ArrowRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-600" />
    </Link>
  );
}

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.round(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function prettyAction(action: string, metadata: unknown): string {
  const meta = (metadata ?? {}) as Record<string, unknown>;
  if (action === 'page.publish') return `Published ${typeof meta.slug === 'string' ? meta.slug : 'a page'}`;
  if (action === 'media.upload') return 'Uploaded media';
  if (action === 'site.provisioned') return 'Site provisioned';
  if (action === 'stripe.checkout_completed') return 'Subscription started';
  return action.replace(/[._]/g, ' ');
}

function previewSubmission(data: unknown): string {
  const d = (data ?? {}) as Record<string, unknown>;
  const name = typeof d.name === 'string' ? d.name : null;
  const message = typeof d.message === 'string' ? d.message.slice(0, 60) : null;
  if (name && message) return `${name} — ${message}`;
  if (name) return name;
  if (message) return message;
  return 'New submission';
}
