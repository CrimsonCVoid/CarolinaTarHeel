'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@tarheel/ui';
import { createBrowserClient } from '@/lib/supabase/browser';

type Mode = 'magic' | 'password';

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('magic');
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
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
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
      router.push(next);
      router.refresh();
    }
  }

  if (state === 'sent') {
    return (
      <p className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        Check your email for a sign-in link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="mt-1.5"
        />
      </div>
      {mode === 'password' ? (
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1.5"
          />
        </div>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" size="lg" className="w-full" disabled={state === 'pending'}>
        {state === 'pending' ? 'Working…' : mode === 'magic' ? 'Send magic link' : 'Sign in'}
      </Button>
      <button
        type="button"
        className="text-sm text-slate-600 hover:text-brand-700"
        onClick={() => setMode(mode === 'magic' ? 'password' : 'magic')}
      >
        {mode === 'magic' ? 'Use password instead' : 'Use magic link instead'}
      </button>
    </form>
  );
}
