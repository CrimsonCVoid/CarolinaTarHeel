import { Card, CardContent, CardHeader, CardTitle, Container } from '@tarheel/ui';
import { listTemplates } from '@tarheel/templates';
import { OnboardForm } from './onboard-form';

export const metadata = { title: 'Onboard new client' };

export default function OnboardPage() {
  const templates = listTemplates().map((t) => ({ id: t.id, name: t.name, description: t.description }));
  return (
    <Container className="py-10">
      <Card>
        <CardHeader>
          <CardTitle>Onboard a new client</CardTitle>
        </CardHeader>
        <CardContent>
          <OnboardForm templates={templates} />
        </CardContent>
      </Card>
    </Container>
  );
}
