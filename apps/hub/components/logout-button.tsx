'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@tarheel/ui';
import { createBrowserClient } from '@/lib/supabase/browser';

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        const supabase = createBrowserClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
      }}
    >
      Log out
    </Button>
  );
}
