import Image from 'next/image';
import { Container } from '@tarheel/ui';

export interface HeroSplitProps {
  headline: string;
  subheadline?: string;
  image: string;
  cta?: { label: string; href: string };
  eyebrow?: string;
}

export function HeroSplit({ headline, subheadline, image, cta, eyebrow }: HeroSplitProps) {
  return (
    <section className="bg-white">
      <Container className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-700">{eyebrow}</p> : null}
          <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">{headline}</h1>
          {subheadline ? <p className="mt-6 max-w-prose text-lg text-slate-700">{subheadline}</p> : null}
          {cta ? (
            <a
              href={cta.href}
              className="mt-8 inline-flex h-12 items-center rounded-2xl bg-brand-600 px-6 text-base font-medium text-white hover:bg-brand-700"
            >
              {cta.label}
            </a>
          ) : null}
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
          <Image src={image} alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </Container>
    </section>
  );
}
