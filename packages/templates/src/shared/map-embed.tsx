import type { Address } from '../types';

/**
 * Lazy-loaded static map. We render only an <iframe> with `loading="lazy"`
 * and a fallback link, so no JS is shipped to render the map.
 */
export function MapEmbed({ address }: { address: Address }) {
  const q = encodeURIComponent(`${address.line1}, ${address.city}, ${address.state} ${address.postalCode}`);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <iframe
        title="Map"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${q}&output=embed`}
        className="h-72 w-full border-0"
      />
      <div className="border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <a
          className="font-medium text-brand-700 hover:underline"
          href={`https://www.google.com/maps/search/?api=1&query=${q}`}
          rel="noopener"
        >
          Open in Google Maps →
        </a>
      </div>
    </div>
  );
}
