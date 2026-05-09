'use client';

import { useState, useTransition } from 'react';
import { Button, Input, Label } from '@tarheel/ui';
import { runOnboarding } from './actions';

interface TemplateChoice {
  id: string;
  name: string;
  description: string;
}

export function OnboardForm({ templates }: { templates: TemplateChoice[] }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<null | { siteId: string; orgId: string; inviteUrl: string; deploymentUrl?: string }>(null);
  const [error, setError] = useState<string | null>(null);

  if (result) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          ✓ Org + site created.
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Org ID</dt>
            <dd className="font-mono text-xs">{result.orgId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Site ID</dt>
            <dd className="font-mono text-xs">{result.siteId}</dd>
          </div>
          {result.deploymentUrl ? (
            <div className="flex justify-between">
              <dt className="text-slate-600">Vercel deploy</dt>
              <dd>
                <a className="text-brand-700 hover:underline" href={`https://${result.deploymentUrl}`} rel="noopener">
                  {result.deploymentUrl}
                </a>
              </dd>
            </div>
          ) : null}
          <div>
            <Label>Client invite link</Label>
            <Input readOnly value={result.inviteUrl} className="mt-1.5 font-mono text-xs" />
            <p className="mt-1 text-xs text-slate-500">Send this to the client. It expires in 24 hours.</p>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        start(async () => {
          try {
            const out = await runOnboarding({
              orgName: String(fd.get('orgName')),
              slug: String(fd.get('slug')),
              ownerEmail: String(fd.get('ownerEmail')),
              domain: String(fd.get('domain')),
              templateId: String(fd.get('templateId')),
              plan: String(fd.get('plan')) as 'starter' | 'standard' | 'premium',
            });
            setResult(out);
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Onboarding failed');
          }
        });
      }}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="orgName">Business name</Label>
          <Input id="orgName" name="orgName" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="slug">Slug (url-safe)</Label>
          <Input id="slug" name="slug" required pattern="[a-z0-9-]+" className="mt-1.5" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ownerEmail">Owner email</Label>
          <Input id="ownerEmail" name="ownerEmail" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="domain">Production domain</Label>
          <Input id="domain" name="domain" required placeholder="joespizza.com" className="mt-1.5" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="templateId">Template</Label>
          <select
            id="templateId"
            name="templateId"
            required
            className="mt-1.5 flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="plan">Plan</Label>
          <select
            id="plan"
            name="plan"
            required
            className="mt-1.5 flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm"
          >
            <option value="starter">Starter — $39/mo</option>
            <option value="standard">Standard — $69/mo</option>
            <option value="premium">Premium — $129/mo</option>
          </select>
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="pt-2">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'Provisioning…' : 'Create org + site'}
        </Button>
      </div>
    </form>
  );
}
