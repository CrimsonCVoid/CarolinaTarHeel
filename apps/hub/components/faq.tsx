import { Container } from '@tarheel/ui';

interface QA {
  q: string;
  a: string;
}

export const FAQ_ITEMS: QA[] = [
  {
    q: 'How is this different from Wix or Squarespace?',
    a: 'Wix and Squarespace ship 2–4 MB of JavaScript to every visitor — page builder runtime, ad scripts, tracking. Our sites ship under 150 KB. The visible difference is load time and search rankings. We also assign you a real human (one of two) who answers calls — they don\'t.',
  },
  {
    q: 'Do I own my website?',
    a: 'Yes. Domain registered in your Cloudflare account (not ours). Content exportable as JSON anytime. Code repository transferable to your own GitHub on request. Your site is yours; we host it and maintain it.',
  },
  {
    q: 'What if I want to leave?',
    a: 'We transfer your repo, content export, and domain control within 48 hours. No cancellation fee. Hosting is month-to-month.',
  },
  {
    q: "What's \"AI-built\" actually mean?",
    a: 'We use AI tools (mainly Claude) to scaffold templates, draft copy, and accelerate code. Every site is then reviewed and finished by a human engineer. The AI saves us time; the human ensures quality. You aren\'t getting a generic AI-generated template.',
  },
  {
    q: 'Can you really ship in 7 days?',
    a: 'Yes, if you provide content (logo, photos, copy basics) on day 1. Standard tier is 7 days from contract signing. We\'ve never missed this with content in hand.',
  },
  {
    q: 'Who handles updates after launch?',
    a: 'You can edit copy, photos, hours, and menu/services yourself in our editor — about 5 minutes for most things. We handle the technical maintenance (SSL, backups, security, performance monitoring) automatically.',
  },
  {
    q: 'Do you do SEO?',
    a: 'Every site ships with Core Web Vitals optimization, structured data (Schema.org JSON-LD), Search Console submission, and IndexNow pings. Standard tier includes quarterly SEO checks; Premium includes monthly reports. We do not sell ongoing SEO retainers — that\'s a separate industry.',
  },
  {
    q: 'What if my site goes down?',
    a: 'Our uptime is 99.98% (Vercel\'s edge network). If something breaks, you can reach us by phone or email and we respond same-day on Standard tier, within 2 hours on Premium. We monitor every site 24/7 and usually fix issues before clients notice.',
  },
  {
    q: 'Can I see your contract?',
    a: 'Yes — we send the full contract before any payment. NC governing law, mutual mediation clause, IP transfer to you on final payment, month-to-month hosting. Plain English, not legalese.',
  },
  {
    q: 'Do you take ecommerce sites?',
    a: 'Not yet as a primary product. We integrate Stripe one-off payments and partner with Shopify for clients who need full ecommerce. A dedicated ecommerce template is on the late-2026 roadmap.',
  },
  {
    q: 'What about a custom application?',
    a: 'Outside our scope. We do websites and basic integrations (forms, booking, Stripe one-off payments). Full custom apps — we\'ll refer you to good Triangle-based developers.',
  },
  {
    q: 'How do you handle hosting fees?',
    a: '$39 / $69 / $129 per month, billed monthly via Stripe. Cancel anytime. No annual contracts. The fee covers Vercel hosting, our editor, monitoring, backups, support, and ongoing edits within your tier\'s allotment.',
  },
];

export function FAQ() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Common questions, direct answers.
          </h2>
          <ul className="mt-10 divide-y divide-slate-200">
            {FAQ_ITEMS.map((item, i) => (
              <li key={i}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-slate-900">
                    <span>{item.q}</span>
                    <span
                      aria-hidden
                      className="text-2xl leading-none text-brand-600 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-quint)] group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-700">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
