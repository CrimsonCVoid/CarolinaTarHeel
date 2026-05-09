import Link from 'next/link';
import { Container } from '@tarheel/ui';
import { requireSiteAccess } from '@/lib/auth';

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const TABS = [
  { href: '', label: 'Overview' },
  { href: '/pages', label: 'Pages' },
  { href: '/media', label: 'Media' },
  { href: '/forms', label: 'Forms' },
  { href: '/settings', label: 'Settings' },
  { href: '/team', label: 'Team' },
  { href: '/billing', label: 'Billing' },
  { href: '/history', label: 'History' },
];

export default async function SiteLayout({ children, params }: Props) {
  const { id } = await params;
  const { site } = await requireSiteAccess(id);
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <Container>
          <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/dashboard" className="text-xs text-slate-500 hover:text-brand-700">
                ← All sites
              </Link>
              <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-slate-900">{site.domain}</h1>
            </div>
          </div>
          <nav className="-mb-px flex flex-wrap gap-x-6 gap-y-2 border-b border-transparent text-sm">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={`/sites/${id}${t.href}`}
                className="border-b-2 border-transparent px-0.5 pb-3 text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
      {children}
    </>
  );
}
