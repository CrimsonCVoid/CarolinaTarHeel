import { Container } from '@tarheel/ui';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <Container className="py-20 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          About
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-700">
          We&apos;re a small Carolina team — one of us comes from the small-business side (HVAC ops, restaurant
          family), the other from product engineering at SaaS startups. We started Tar Heel Web Co. because the
          options for a $5M/year local business were either a thousand-dollar Wix subscription that nobody
          updates or a fifty-thousand-dollar agency build that nobody can edit.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-slate-700">
          We pick a third path: productized templates, AI-accelerated production, an editor that lets the
          owner change hours and prices in seconds, and a public site that ships less JavaScript than your
          customer&apos;s email signature.
        </p>

        <h2 className="mt-16 font-display text-2xl font-semibold tracking-tight text-slate-900">How we work</h2>
        <ol className="mt-6 space-y-4 text-base text-slate-700">
          <li>
            <span className="font-semibold text-slate-900">Discovery (20 min, free).</span> What you sell, who
            buys it, what&apos;s broken about your current site.
          </li>
          <li>
            <span className="font-semibold text-slate-900">Build (5–10 days).</span> We pick a template, fill
            it with your real photos and copy, and ship a preview link.
          </li>
          <li>
            <span className="font-semibold text-slate-900">Launch.</span> We point your domain, hand over the
            editor, and stay on call.
          </li>
        </ol>

        <h2 className="mt-16 font-display text-2xl font-semibold tracking-tight text-slate-900">Where we work</h2>
        <p className="mt-4 text-base leading-relaxed text-slate-700">
          The Triangle, the Triad, Charlotte, the coast. If you&apos;re in NC, we&apos;ll come meet you in
          person. If you&apos;re elsewhere in the southeast, we&apos;ll do it on Zoom and ship you something
          that loads on the worst phone in your customer base.
        </p>
      </div>
    </Container>
  );
}
