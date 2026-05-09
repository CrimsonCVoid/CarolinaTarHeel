import Link from 'next/link';
import { Container } from '@tarheel/ui';

export function FinalCTA() {
  return (
    <section className="bg-slate-900 py-24 text-white md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Ready to ship a faster website?
          </h2>
          <Link
            href="/contact"
            className="mt-10 inline-flex h-14 items-center rounded-2xl bg-white px-8 text-lg font-semibold text-slate-900 transition-colors duration-[var(--dur-fast)] hover:bg-slate-100 active:scale-[0.97] motion-reduce:active:scale-100"
          >
            Book a 15-minute call →
          </Link>
          <p className="mt-6 text-base text-slate-300">No pitch. No deck. Just a conversation.</p>
        </div>
      </Container>
    </section>
  );
}
