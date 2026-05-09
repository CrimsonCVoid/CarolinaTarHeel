import { Container } from '@tarheel/ui';

export interface FaqItem {
  question: string;
  answer: string;
}

/** Uses native <details> for zero-JS accordion. */
export function FAQ({ headline, items }: { headline: string; items: FaqItem[] }) {
  return (
    <section className="bg-white">
      <Container className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {headline}
          </h2>
          <dl className="mt-10 divide-y divide-slate-200">
            {items.map((item, i) => (
              <details key={i} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-slate-900">
                  <span>{item.question}</span>
                  <span aria-hidden className="text-brand-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-slate-700">{item.answer}</p>
              </details>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
