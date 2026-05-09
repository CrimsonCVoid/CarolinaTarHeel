import Link from 'next/link';
import { Container } from '@tarheel/ui';
import { env } from '@/lib/env';
import { SiteFooter } from '@/components/site-footer';

const NAV = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="border-b border-slate-200 bg-white">
        <Container>
          <nav className="flex h-16 items-center justify-between" aria-label="Primary">
            <Link href="/" className="font-display text-base font-semibold tracking-tight text-slate-900">
              {env.NEXT_PUBLIC_BRAND_NAME}
            </Link>
            <ul className="hidden items-center gap-8 md:flex">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sm font-medium text-slate-700 hover:text-brand-700">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="text-sm font-semibold text-brand-700 hover:text-brand-900"
            >
              Client login →
            </Link>
          </nav>
        </Container>
      </header>
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
