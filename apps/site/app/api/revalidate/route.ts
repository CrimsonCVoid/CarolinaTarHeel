import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { env } from '@/lib/env';

const bodySchema = z.object({
  paths: z.array(z.string().min(1)).min(1).max(50),
});

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidation-secret');
  if (!secret || secret !== env.REVALIDATION_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  let parsed: z.infer<typeof bodySchema>;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  for (const p of parsed.paths) revalidatePath(p);
  return Response.json({ revalidated: parsed.paths });
}
