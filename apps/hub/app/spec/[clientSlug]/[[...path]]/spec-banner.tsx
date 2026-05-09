/**
 * Tiny sticky bar shown above every spec preview page. Tells the viewer this
 * is a spec build by Tar Heel Web Co. and points them at the agency. Server
 * component — no JS shipped.
 */
export function SpecBanner({ brandName, cityState }: { brandName: string; cityState: string }) {
  return (
    <div
      role="region"
      aria-label="Spec preview banner"
      className="fixed inset-x-0 top-0 z-50 border-b border-amber-200 bg-amber-50/95 px-4 py-1.5 text-xs text-amber-900 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="font-semibold uppercase tracking-wide">Spec preview</span>
        <span className="hidden text-amber-700 sm:inline" aria-hidden>
          ·
        </span>
        <span>
          A redesign concept for <strong>{brandName}</strong> ({cityState}) by Tar Heel Web Co. — not affiliated.
        </span>
        <span className="hidden text-amber-700 sm:inline" aria-hidden>
          ·
        </span>
        <a
          href="https://tarheelweb.co/contact"
          className="font-semibold underline decoration-amber-400 underline-offset-2 hover:text-amber-950"
        >
          Build the real thing
        </a>
      </div>
    </div>
  );
}
