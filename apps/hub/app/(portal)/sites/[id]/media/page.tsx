import { Container } from '@tarheel/ui';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { MediaGrid } from './media-grid';

export const metadata = { title: 'Media' };

export default async function MediaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireSiteAccess(id);
  const supabase = await createServerClient();
  const { data: media } = await supabase
    .from('media')
    .select('id, public_url, alt_text, width, height, size_bytes, mime_type, created_at, storage_path')
    .eq('site_id', id)
    .order('created_at', { ascending: false });

  return (
    <Container className="py-10">
      <MediaGrid siteId={id} initial={media ?? []} />
    </Container>
  );
}
