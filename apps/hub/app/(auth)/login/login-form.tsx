'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@tarheel/ui';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/browser';

type Mode = 'magic' | 'password';

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<'idle' | 'pending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('pending');
    setError(null);
    const supabase = createBrowserClient();
    if (mode === 'magic') {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // No `next` query — the callback's smart redirect will pick the
          // user's only site (or /dashboard if they have multiple).
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (err) {
        setError(err.message);
        setState('error');
        return;
      }
      setState('sent');
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        setState('error');
        return;
      }
      // For password sign-ins, we need to route the user the same way the
      // magic-link callback does. Hit the callback with no code — it'll
      // detect the session, find the user's primary site, and redirect.
      router.push(next === '/' ? '/auth/callback' : next);
      router.refresh();
    }
  }

  if (state === 'sent') {
    return (
      <div
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900"
        role="status"
      >
        <p className="font-semibold">Check your email.</p>
        <p className="mt-1 text-emerald-800">
          We sent a sign-in link to <strong>{email}</strong>. The link expires in 60 minutes.
        </p>
        <button
          type="button"
          onClick={() => {
            setState('idle');
            setEmail('');
          }}
          className="mt-3 text-xs font-medium text-emerald-900 underline-offset-2 hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative mt-1.5">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            className="pl-9"
          />
        </div>
      </div>

      {mode === 'password' ? (
        <div>
          <div className="flex items-baseline justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => setMode('magic')}
              className="text-xs text-slate-500 underline-offset-2 hover:text-brand-700 hover:underline"
            >
              Forgot password? Email me a link
            </button>
          </div>
          <div className="relative mt-1.5">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="pl-9"
            />
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={state === 'pending'}>
        {state === 'pending' ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {mode === 'magic' ? 'Sending link…' : 'Signing in…'}
          </span>
        ) : mode === 'magic' ? (
          'Email me a sign-in link'
        ) : (
          'Sign in'
        )}
      </Button>

      <button
        type="button"
        className="block w-full text-center text-sm text-slate-600 transition-colors hover:text-brand-700"
        onClick={() => setMode(mode === 'magic' ? 'password' : 'magic')}
      >
        {mode === 'magic' ? 'Use password instead' : 'Use a magic link instead'}
      </button>
    </form>
  );
}
