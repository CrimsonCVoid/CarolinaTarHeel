import { Container } from '@tarheel/ui';

/*
 * Generic shimmer block — slate-100→slate-200→slate-100 sweep, infinite,
 * paused under prefers-reduced-motion via the global reset. Used as the
 * Suspense fallback for every dynamic-imported section so the page
 * doesn't pop empty regions while chunks load.
 */
function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-xl ${className ?? ''}`}
      style={{
        background:
          'linear-gradient(90deg, rgb(241 245 249) 0%, rgb(226 232 240) 50%, rgb(241 245 249) 100%)',
        backgroundSize: '200% 100%',
        animation: 'thw-shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
      aria-hidden
    />
  );
}

export function SectionSkeleton({
  height = 480,
  bg = 'bg-slate-50',
}: {
  height?: number;
  bg?: string;
}) {
  return (
    <section className={`${bg} py-20 md:py-24`}>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Shimmer className="mx-auto mb-3 h-3 w-32" />
          <Shimmer className="mx-auto h-8 w-3/4" />
          <Shimmer className="mx-auto mt-3 h-4 w-1/2" />
        </div>
        <Shimmer className="mt-12 w-full" style={{ height }} />
      </Container>
    </section>
  );
}

// Variants tuned for specific sections so the skeleton roughly matches the
// real layout — keeps CLS at zero when the chunk hydrates.

export function ChartGridSkeleton() {
  return (
    <section className="bg-slate-50 py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Shimmer className="mx-auto h-9 w-2/3" />
          <Shimmer className="mx-auto mt-3 h-4 w-1/2" />
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
              <Shimmer className="h-5 w-40" />
              <Shimmer className="mt-2 h-3 w-56" />
              <Shimmer className="mt-4 h-56 w-full" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function CardsRowSkeleton() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Shimmer className="mx-auto h-9 w-1/2" />
          <Shimmer className="mx-auto mt-3 h-4 w-2/3" />
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
              <Shimmer className="aspect-[16/10] w-full" />
              <Shimmer className="mt-4 h-5 w-32" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Shimmer className="h-12" />
                <Shimmer className="h-12" />
                <Shimmer className="h-12" />
              </div>
              <Shimmer className="mt-4 h-16 w-full" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function RaceSkeleton() {
  return (
    <section className="bg-slate-900 py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto h-10 w-2/3 rounded bg-white/10" />
          <div className="mx-auto mt-4 h-4 w-1/2 rounded bg-white/5" />
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-2xl bg-slate-800/60 p-6">
              <div className="h-72 rounded bg-white/5" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="h-10 rounded bg-white/5" />
                <div className="h-10 rounded bg-white/5" />
                <div className="h-10 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
