import Link from 'next/link';
import { Container } from '@tarheel/ui';
import { RevealSection } from '@/components/reveal-section';

export default function MarketingHome() {
  return (
    <>
      <section className="bg-white">
        <Container className="py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              Built in Carolina · For Carolina
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Fast websites, simple pricing,
              <br />
              <span className="text-brand-700">no platform fees</span>.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              Productized website builds for small NC businesses — restaurants, med spas, law firms, home
              services. Half the price of an agency, ten times faster than Wix.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center rounded-2xl bg-brand-600 px-6 text-base font-medium text-white hover:bg-brand-700"
              >
                Book a discovery call
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center rounded-2xl border border-slate-300 px-6 text-base font-medium text-slate-900 hover:bg-slate-50"
              >
                See pricing
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <RevealSection className="border-y border-slate-200 bg-slate-50">
        <Container className="py-16 md:py-20">
          <ul className="grid gap-8 md:grid-cols-3">
            <li>
              <p className="font-display text-3xl font-semibold text-slate-900">95+</p>
              <p className="mt-1 text-sm font-medium text-slate-700">Lighthouse mobile, every site</p>
              <p className="mt-2 text-sm text-slate-600">
                We refuse to ship a site under 95. Your customers feel it on every tap.
              </p>
            </li>
            <li>
              <p className="font-display text-3xl font-semibold text-slate-900">&lt; 5s</p>
              <p className="mt-1 text-sm font-medium text-slate-700">From edit to live</p>
              <p className="mt-2 text-sm text-slate-600">
                Update hours, prices, photos. Hit publish. Visitors see it within seconds.
              </p>
            </li>
            <li>
              <p className="font-display text-3xl font-semibold text-slate-900">$0</p>
              <p className="mt-1 text-sm font-medium text-slate-700">Lock-in</p>
              <p className="mt-2 text-sm text-slate-600">
                Your domain, your content. One-click export. Walk away whenever.
              </p>
            </li>
          </ul>
        </Container>
      </RevealSection>

      <RevealSection className="bg-white">
        <Container className="py-20 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                The performance moat is real
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-700">
                Wix and Squarespace ship megabytes of editor JavaScript to every visitor. Our public sites ship
                under 150 KB — the same as a static brochure site, but you can edit any field in seconds.
              </p>
              <p className="mt-4 text-base text-slate-700">
                On a 4G phone in your customer&apos;s pocket, that&apos;s the difference between a site that loads
                in 1 second and one that loads in 6.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900">
                What you get
              </h3>
              <ul className="mt-6 space-y-3 text-base text-slate-700">
                <li className="flex gap-3"><span className="text-brand-600">✓</span> Custom-built site, owned by you</li>
                <li className="flex gap-3"><span className="text-brand-600">✓</span> Self-serve editor at {process.env.NEXT_PUBLIC_BRAND_DOMAIN ?? 'tarheelweb.co'}</li>
                <li className="flex gap-3"><span className="text-brand-600">✓</span> Hosting + monitoring + backups</li>
                <li className="flex gap-3"><span className="text-brand-600">✓</span> Form inbox + email notifications</li>
                <li className="flex gap-3"><span className="text-brand-600">✓</span> Local NC team, real phone numbers</li>
              </ul>
            </div>
          </div>
        </Container>
      </RevealSection>

      <RevealSection className="bg-slate-900 text-white">
        <Container className="py-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Ready to launch this month?
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              We start with a 20-minute call to scope the build. No obligation.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex h-12 items-center rounded-2xl bg-white px-6 text-base font-medium text-slate-900 hover:bg-slate-100"
            >
              Book a call
            </Link>
          </div>
        </Container>
      </RevealSection>
    </>
  );
}
