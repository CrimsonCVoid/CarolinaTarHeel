import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyPreviewToken } from '@/lib/preview-token';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const slug = url.searchParams.get('slug') ?? '/';
  if (!token || !verifyPreviewToken(token)) {
    return new Response('Invalid preview token', { status: 401 });
  }
  (await draftMode()).enable();
  redirect(slug);
}
