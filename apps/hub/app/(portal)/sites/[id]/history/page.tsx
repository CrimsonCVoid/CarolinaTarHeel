import { Card, CardContent, CardHeader, CardTitle, Container } from '@tarheel/ui';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';

export const metadata = { title: 'History' };

export default async function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireSiteAccess(id);
  const supabase = await createServerClient();
  const { data: events } = await supabase
    .from('audit_log')
    .select('action, metadata, created_at')
    .eq('site_id', id)
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <Container className="py-10">
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {(events ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {events!.map((e, i) => (
                <li key={i} className="grid grid-cols-[180px_1fr] gap-4 py-3 text-sm">
                  <span className="text-xs text-slate-500">{new Date(e.created_at).toLocaleString()}</span>
                  <div>
                    <span className="font-medium text-slate-900">{e.action}</span>
                    {e.metadata && Object.keys(e.metadata as object).length > 0 ? (
                      <pre className="mt-1 overflow-x-auto rounded bg-slate-50 p-2 text-xs text-slate-600">
                        {JSON.stringify(e.metadata, null, 2)}
                      </pre>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
