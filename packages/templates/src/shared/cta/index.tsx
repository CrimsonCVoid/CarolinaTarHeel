import { Container } from '@tarheel/ui';

export function CTA({
  headline,
  subheadline,
  label,
  href,
  variant = 'dark',
}: {
  headline: string;
  subheadline?: string;
  label: string;
  href: string;
  variant?: 'dark' | 'light';
}) {
  const dark = variant === 'dark';
  return (
    <section className={dark ? 'bg-slate-900 text-white' : 'bg-brand-50 text-slate-900'}>
      <Container className="py-16 md:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{headline}</h2>
          {subheadline ? (
            <p className={`mt-4 text-lg ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{subheadline}</p>
          ) : null}
          <a
            href={href}
            className={`mt-8 inline-flex h-12 items-center rounded-2xl px-6 text-base font-medium ${
              dark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
          >
            {label}
          </a>
        </div>
      </Container>
    </section>
  );
}
