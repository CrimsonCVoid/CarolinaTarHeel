import { Card, CardContent, CardHeader, CardTitle, Container } from '@tarheel/ui';
import { getTemplate } from '@tarheel/templates';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { SettingsForm } from './settings-form';

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

  return (
    <Container className="py-10">
      <Card>
        <CardHeader>
          <CardTitle>Site settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm
            siteId={id}
            meta={template.settingsEditorMeta}
            initial={(settings ?? { brand: {}, contact: {}, hours: {}, social: {}, seo: {} }) as Record<string, unknown>}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
