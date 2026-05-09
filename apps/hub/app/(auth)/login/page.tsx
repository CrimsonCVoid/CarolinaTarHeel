import Link from 'next/link';
import { LoginForm } from './login-form';

export const metadata = { title: 'Log in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const sp = await searchParams;
  return (
    <main className="flex min-h-screen flex-col bg-white lg:grid lg:grid-cols-2">
      {/* Brand panel — hidden on mobile, visible from lg up. Subtle gradient
          plus radial highlights; pure CSS, zero JS. */}
      <aside className="relative hidden overflow-hidden bg-slate-900 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-95"
          style={{
            background:
              'radial-gradient(800px 500px at 20% 10%, rgba(68,126,168,0.35), transparent 70%), radial-gradient(700px 600px at 80% 90%, rgba(40,69,95,0.45), transparent 70%), linear-gradient(180deg, #243b51 0%, #162636 100%)',
          }}
        />
        <Link href="/" className="relative z-10 font-display text-lg font-semibold tracking-tight">
          Tar Heel Web Co.
        </Link>
        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Edit your site in <span className="text-brand-300">five minutes</span>.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-slate-200">
            Same editor we use to build your site. Update copy, photos, hours, menu items — hit publish and
            visitors see it within seconds. No rebuilds. No tickets. No tutorials.
          </p>
          <ul className="mt-10 space-y-3 text-sm text-slate-200">
            <Trust>Real human support · same-day on Standard</Trust>
            <Trust>99.98% uptime · Vercel edge</Trust>
            <Trust>You own the domain, the content, the export</Trust>
          </ul>
        </div>
        <p className="relative z-10 text-xs text-slate-400">
          Need help?{' '}
          <a href="mailto:hello@tarheelweb.co" className="text-brand-200 hover:underline">
            hello@tarheelweb.co
          </a>
          {' · '}(919) 555-0100
        </p>
      </aside>

      {/* Form panel */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-brand-700 lg:hidden"
          >
            ← Tar Heel Web Co.
          </Link>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">Sign in to manage your site.</p>
          <div className="mt-8">
            <LoginForm next={sp.next ?? '/'} />
          </div>
          <p className="mt-10 text-xs text-slate-500">
            By signing in you agree to our{' '}
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

function Trust({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <svg viewBox="0 0 16 16" aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path
          d="M5 8.2l2 2 4-4.4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}
