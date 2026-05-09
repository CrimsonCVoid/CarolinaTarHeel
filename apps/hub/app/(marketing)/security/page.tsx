import { Container } from '@tarheel/ui';

export const metadata = { title: 'Security' };

export default function SecurityPage() {
  return (
    <Container className="py-20 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Security
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Found something? Email{' '}
          <a className="text-brand-700 hover:underline" href="mailto:security@tarheelweb.co">
            security@tarheelweb.co
          </a>{' '}
          — we reply within 1 business day. We don&apos;t pay bounties, but we&apos;ll publicly thank you in
          our acknowledgments page after the issue is fixed.
        </p>
        <h2 className="mt-12 font-display text-2xl font-semibold text-slate-900">In scope</h2>
        <ul className="mt-4 list-inside list-disc space-y-1 text-base text-slate-700">
          <li>tarheelweb.co (the hub)</li>
          <li>any *.tarheelweb.co subdomain we operate</li>
          <li>client sites we host (only with the client&apos;s authorization)</li>
        </ul>
        <h2 className="mt-10 font-display text-2xl font-semibold text-slate-900">Out of scope</h2>
        <ul className="mt-4 list-inside list-disc space-y-1 text-base text-slate-700">
          <li>Spam / social engineering / DoS</li>
          <li>Self-XSS</li>
          <li>Issues in third-party services we depend on (report to them directly)</li>
        </ul>
      </div>
    </Container>
  );
}
