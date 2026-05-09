import { getFleetStats } from '@/lib/stats';

export const revalidate = 3600;

export async function GET() {
  const stats = await getFleetStats();
  return Response.json(stats, {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
