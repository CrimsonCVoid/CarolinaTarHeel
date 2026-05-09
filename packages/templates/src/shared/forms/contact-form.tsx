'use client';

import { useState } from 'react';
import { Button, Container, Input, Label, Textarea } from '@tarheel/ui';

export interface ContactFormProps {
  formId?: string;
  headline?: string;
  fields?: Array<{ name: string; label: string; kind: 'text' | 'email' | 'tel' | 'textarea'; required?: boolean }>;
}

const DEFAULT_FIELDS: NonNullable<ContactFormProps['fields']> = [
  { name: 'name', label: 'Name', kind: 'text', required: true },
  { name: 'email', label: 'Email', kind: 'email', required: true },
  { name: 'phone', label: 'Phone', kind: 'tel' },
  { name: 'message', label: 'Message', kind: 'textarea', required: true },
];

export function ContactForm({ formId = 'contact', headline = 'Send us a note', fields = DEFAULT_FIELDS }: ContactFormProps) {
  const [state, setState] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (fd.get('website')) {
      setState('sent');
      return;
    }
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setState('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <section className="bg-white">
        <Container className="py-16 md:py-20">
          <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-emerald-900">Thanks — we&apos;ll be in touch.</h2>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <Container className="py-16 md:py-20">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {headline}
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            {fields.map((f) => (
              <div key={f.name}>
                <Label htmlFor={f.name}>{f.label}{f.required ? <span className="text-red-600"> *</span> : null}</Label>
                <div className="mt-1.5">
                  {f.kind === 'textarea' ? (
                    <Textarea id={f.name} name={f.name} required={f.required} rows={5} />
                  ) : (
                    <Input id={f.name} name={f.name} type={f.kind} required={f.required} autoComplete="on" />
                  )}
                </div>
              </div>
            ))}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" size="lg" disabled={state === 'submitting'}>
              {state === 'submitting' ? 'Sending…' : 'Send'}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
