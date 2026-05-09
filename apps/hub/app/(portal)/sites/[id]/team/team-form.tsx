'use client';

import { useState, useTransition } from 'react';
import { Button, Input, Label } from '@tarheel/ui';
import { inviteMember } from './actions';

export function TeamForm({ orgId }: { orgId: string }) {
  const [pending, start] = useTransition();
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        start(async () => {
          try {
            const url = await inviteMember(orgId, String(fd.get('email')), String(fd.get('role')) as 'editor' | 'owner');
            setLink(url);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Invite failed');
          }
        });
      }}
      className="grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-[1fr_140px_auto]"
    >
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          className="mt-1.5 flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm"
        >
          <option value="editor">Editor</option>
          <option value="owner">Owner</option>
        </select>
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Invite'}
        </Button>
      </div>
      {error ? <p className="col-span-full text-sm text-red-600">{error}</p> : null}
      {link ? (
        <div className="col-span-full">
          <Label>Invite link</Label>
          <Input readOnly value={link} className="mt-1.5 font-mono text-xs" />
        </div>
      ) : null}
    </form>
  );
}
