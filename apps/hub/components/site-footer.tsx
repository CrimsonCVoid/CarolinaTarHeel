import Link from 'next/link';
import { Container } from '@tarheel/ui';

const PORTFOLIO_SAMPLES = [
  "Joe's Pizza · Apex",
  'Wagner & Co Law · Raleigh',
  'Triangle HVAC · Cary',
  'Sage Med Spa · Chapel Hill',
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-16 text-sm text-slate-600">
      <Container>
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="font-display text-base font-semibold text-slate-900">Tar Heel Web Co.</div>
            <p className="mt-3 text-slate-600">Built in Carolina · Hosted on Vercel · Designed by humans.</p>
            <div className="mt-4 space-y-1 text-slate-700">
              <div>
                <a className="hover:text-brand-700" href="mailto:hello@tarheelweb.co">
                  hello@tarheelweb.co
                </a>
              </div>
              <div>(919) 555-0100</div>
              <div className="text-slate-500">Apex, NC</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Carolina sites in progress</div>
            <ul className="mt-3 space-y-1.5">
              {PORTFOLIO_SAMPLES.map((c) => (
                <li key={c}>{c}</li>
              ))}
              <li className="text-slate-400">+ more on the way</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product</div>
            <ul className="mt-3 space-y-1.5">
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
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Legal</div>
            <ul className="mt-3 space-y-1.5">
              <li>
                <Link href="/privacy" className="hover:text-brand-700">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-700">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-brand-700">
                  Security
                </Link>
              </li>
              <li className="text-emerald-700">
                <Link href="/status" className="hover:underline">
                  Status — live
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row">
          <span>© {new Date().getFullYear()} Tar Heel Web Co. All rights reserved.</span>
          <span>
            Built fast on purpose. Site bundle &lt;150 KB JS gzipped on every public client site.
          </span>
        </div>
      </Container>
    </footer>
  );
}
