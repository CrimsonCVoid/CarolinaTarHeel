import Link from 'next/link';
import { Container } from '@tarheel/ui';
import { env } from '@/lib/env';

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
      <footer className="border-t border-slate-200 bg-slate-50 py-12 text-sm text-slate-600">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <span>
              © {new Date().getFullYear()} {env.NEXT_PUBLIC_BRAND_NAME}. Built in North Carolina.
            </span>
            <ul className="flex flex-wrap gap-6">
              <li>
                <Link href="/pricing" className="hover:text-brand-700">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-brand-700">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-700">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-700">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </footer>
    </div>
  );
}
