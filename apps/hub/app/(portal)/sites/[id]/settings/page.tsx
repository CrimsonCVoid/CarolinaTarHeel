import { Card, CardContent, CardHeader, CardTitle, Container } from '@tarheel/ui';
import { getTemplate } from '@tarheel/templates';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { SettingsForm } from './settings-form';
import { ThemePresets } from '@/components/settings/theme-presets';

export const metadata = { title: 'Settings' };

export default async function SiteSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site } = await requireSiteAccess(id);
  const template = getTemplate(site.template_id);
  const supabase = await createServerClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('brand, contact, hours, social, seo')
    .eq('site_id', id)
    .maybeSingle();

  const brand = (settings?.brand as Record<string, unknown> | null) ?? {};
  const currentPrimary = typeof brand.primary === 'string' ? brand.primary : undefined;

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">Brand, contact, hours, and how visitors find you.</p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemePresets siteId={id} currentPrimary={currentPrimary} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All fields</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm
            siteId={id}
            meta={template.settingsEditorMeta}
            initial={
              (settings ?? { brand: {}, contact: {}, hours: {}, social: {}, seo: {} }) as Record<string, unknown>
            }
          />
        </CardContent>
      </Card>
    </Container>
  );
}
