import { requireSiteAccess } from '@/lib/auth';

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

/*
 * Simplified site layout. The sidebar (one level up at (portal)/layout.tsx)
 * owns brand chrome, site context, and primary nav. This layout just
 * verifies access and forwards children — pages render their own headers
 * with whatever density they need.
 */
export default async function SiteLayout({ children, params }: Props) {
  const { id } = await params;
  await requireSiteAccess(id);
  return <>{children}</>;
}
