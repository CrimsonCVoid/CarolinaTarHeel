import { Container } from '@tarheel/ui';
import type { SiteSettings } from '../types.js';

interface NavLink {
  label: string;
  href: string;
}

export function Nav({ settings, links }: { settings: SiteSettings; links: NavLink[] }) {
  const brand = settings.brand.name ?? 'Site';
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container>
        <nav className="flex h-16 items-center justify-between" aria-label="Primary">
          <a href="/" className="font-display text-lg font-semibold tracking-tight text-slate-900">
            {brand}
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-slate-700 hover:text-brand-600"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {settings.contact.phone ? (
            <a
              href={`tel:${settings.contact.phone}`}
              className="hidden text-sm font-semibold text-brand-700 md:inline-block"
            >
              {settings.contact.phone}
            </a>
          ) : null}
        </nav>
      </Container>
    </header>
  );
}
