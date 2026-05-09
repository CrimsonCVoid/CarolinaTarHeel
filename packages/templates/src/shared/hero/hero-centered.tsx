import Image from 'next/image';
import { Container } from '@tarheel/ui';

export interface HeroCenteredProps {
  headline: string;
  subheadline?: string;
  bgImage?: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  eyebrow?: string;
}

export function HeroCentered({ headline, subheadline, bgImage, cta, secondaryCta, eyebrow }: HeroCenteredProps) {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {bgImage ? (
        <Image
          src={bgImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover opacity-40"
        />
      ) : null}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80" />
      <Container className="relative z-20 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-300">{eyebrow}</p> : null}
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">{headline}</h1>
          {subheadline ? <p className="mt-6 text-lg text-slate-200 md:text-xl">{subheadline}</p> : null}
          {(cta ?? secondaryCta) ? (
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {cta ? (
                <a
                  href={cta.href}
                  className="inline-flex h-12 items-center rounded-2xl bg-white px-6 text-base font-medium text-slate-900 hover:bg-slate-100"
                >
                  {cta.label}
                </a>
              ) : null}
              {secondaryCta ? (
                <a
                  href={secondaryCta.href}
                  className="inline-flex h-12 items-center rounded-2xl border border-white/40 px-6 text-base font-medium text-white hover:bg-white/10"
                >
                  {secondaryCta.label}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
