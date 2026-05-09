import { LoginForm } from './login-form';
import { Container } from '@tarheel/ui';

export const metadata = { title: 'Log in' };

export default function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50">
      <Container className="max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">Log in</h1>
          <p className="mt-1 text-sm text-slate-600">Magic link or password.</p>
          <LoginFormWithNext searchParams={searchParams} />
        </div>
      </Container>
    </main>
  );
}

async function LoginFormWithNext({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const sp = await searchParams;
  return <LoginForm next={sp.next ?? '/dashboard'} />;
}
