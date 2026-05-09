'use client';

import { useState } from 'react';
import { Button, Input, Label, Textarea } from '@tarheel/ui';
import { submitLead } from './actions';

export function LeadForm() {
  const [state, setState] = useState<'idle' | 'pending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (state === 'sent') {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <p className="text-base font-semibold">Got it — we&apos;ll be in touch.</p>
        <p className="mt-1 text-sm">Reply within one business day, usually same day.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setState('pending');
        setError(null);
        const fd = new FormData(e.currentTarget);
        if (fd.get('website')) {
          setState('sent');
          return;
        }
        try {
          await submitLead({
            name: String(fd.get('name')),
            email: String(fd.get('email')),
            phone: String(fd.get('phone') ?? ''),
            business: String(fd.get('business') ?? ''),
            tier: String(fd.get('tier') ?? '') as '' | 'starter' | 'standard' | 'premium',
            message: String(fd.get('message') ?? ''),
          });
          setState('sent');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Submission failed');
          setState('error');
        }
      }}
      className="space-y-4"
      noValidate
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="business">Business name</Label>
          <Input id="business" name="business" className="mt-1.5" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="tier">Interested tier</Label>
        <select
          id="tier"
          name="tier"
          className="mt-1.5 flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <option value="">Not sure yet</option>
          <option value="starter">Starter ($750)</option>
          <option value="standard">Standard ($1,500)</option>
          <option value="premium">Premium ($2,750)</option>
        </select>
      </div>
      <div>
        <Label htmlFor="message">What would you like the site to do?</Label>
        <Textarea id="message" name="message" rows={4} className="mt-1.5" />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" size="lg" disabled={state === 'pending'} className="w-full">
        {state === 'pending' ? 'Sending…' : 'Send'}
      </Button>
    </form>
  );
}
