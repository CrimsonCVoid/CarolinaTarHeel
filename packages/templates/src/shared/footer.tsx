import { Container } from '@tarheel/ui';
import type { SiteSettings } from '../types';

export function Footer({ settings }: { settings: SiteSettings }) {
  const brand = settings.brand.name ?? 'Site';
  const year = new Date().getFullYear();
  const addr = settings.contact.address;
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 text-sm text-slate-600">
      <Container>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-display text-base font-semibold text-slate-900">{brand}</div>
            {addr ? (
              <address className="not-italic text-slate-600">
                {addr.line1}
                {addr.line2 ? <><br />{addr.line2}</> : null}
                <br />
                {addr.city}, {addr.state} {addr.postalCode}
              </address>
            ) : null}
          </div>
          <div>
            <div className="font-medium text-slate-900">Contact</div>
            <ul className="mt-2 space-y-1">
              {settings.contact.phone ? (
                <li>
                  <a className="hover:text-brand-700" href={`tel:${settings.contact.phone}`}>
                    {settings.contact.phone}
                  </a>
                </li>
              ) : null}
              {settings.contact.email ? (
                <li>
                  <a className="hover:text-brand-700" href={`mailto:${settings.contact.email}`}>
                    {settings.contact.email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div>
            <div className="font-medium text-slate-900">Follow</div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {(Object.entries(settings.social) as [string, string | undefined][]).map(([k, url]) =>
                url ? (
                  <li key={k}>
                    <a className="capitalize hover:text-brand-700" href={url} rel="me noopener">
                      {k}
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row">
          <span>
            © {year} {brand}. All rights reserved.
          </span>
          <span>
            Built by{' '}
            <a className="hover:text-brand-700" href="https://tarheelweb.co" rel="noopener">
              Tar Heel Web Co.
            </a>
          </span>
        </div>
      </Container>
    </footer>
  );
}
