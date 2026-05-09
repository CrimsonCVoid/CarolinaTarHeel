import { Container } from '@tarheel/ui';
import { LeadForm } from './lead-form';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <Container className="py-20 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Tell us about your business.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            We reply within one business day. If you&apos;re a hurry, mention &ldquo;urgent&rdquo; in the
            message and we&apos;ll get back same day.
          </p>
          <dl className="mt-10 space-y-4 text-sm text-slate-700">
            <div>
              <dt className="font-semibold text-slate-900">Email</dt>
              <dd>
                <a className="hover:text-brand-700" href="mailto:hello@tarheelweb.co">
                  hello@tarheelweb.co
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Phone</dt>
              <dd>(919) 555-0100</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Office</dt>
              <dd>Raleigh, NC</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <LeadForm />
        </div>
      </div>
    </Container>
  );
}
