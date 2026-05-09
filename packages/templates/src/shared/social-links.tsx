import { Facebook, Instagram, type LucideIcon } from 'lucide-react';
import type { Social } from '../types';

const ICONS: Partial<Record<keyof Social, LucideIcon>> = {
  instagram: Instagram,
  facebook: Facebook,
};

export function SocialLinks({ social, className }: { social: Social; className?: string }) {
  const entries = Object.entries(social).filter(([, v]) => Boolean(v)) as [keyof Social, string][];
  if (entries.length === 0) return null;
  return (
    <ul className={className ?? 'flex items-center gap-3'}>
      {entries.map(([key, url]) => {
        const Icon = ICONS[key];
        return (
          <li key={key}>
            <a
              href={url}
              rel="me noopener"
              aria-label={`${key} (opens in new tab)`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {Icon ? <Icon className="h-4 w-4" aria-hidden /> : <span className="text-xs capitalize">{key.slice(0, 2)}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
