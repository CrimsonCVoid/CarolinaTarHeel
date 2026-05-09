import { Container } from '@tarheel/ui';
import { CoreWebVitalsDials } from './cwv-dials';
import { IndexingChart } from './indexing-chart';
import { RankingsChart } from './rankings-chart';
import { OrganicTrafficChart } from './traffic-chart';

export function SeoProofPanel() {
  return (
    <section className="bg-slate-50 py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Built to be found.
          </h2>
          <p className="mt-4 text-lg text-slate-700">
            Every site we ship is technically perfect for Google — and we&apos;ll show you the proof.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <CoreWebVitalsDials />
          <IndexingChart />
          <RankingsChart />
          <OrganicTrafficChart />
        </div>
      </Container>
    </section>
  );
}
