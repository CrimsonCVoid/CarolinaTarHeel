import 'server-only';
import { env } from './env.js';

const API = 'https://api.vercel.com';

interface VercelEnvVar {
  key: string;
  value: string;
  target: ('production' | 'preview' | 'development')[];
  type: 'plain' | 'encrypted' | 'secret';
}

function authHeader() {
  if (!env.VERCEL_API_TOKEN) throw new Error('VERCEL_API_TOKEN not set');
  return { Authorization: `Bearer ${env.VERCEL_API_TOKEN}` };
}

function teamQuery() {
  return env.VERCEL_TEAM_ID ? `?teamId=${env.VERCEL_TEAM_ID}` : '';
}

export async function createSiteProject(opts: {
  projectName: string; // url-safe slug
  domain: string;
  envVars: VercelEnvVar[];
}): Promise<{ projectId: string; deploymentUrl: string }> {
  if (!env.VERCEL_SITE_TEMPLATE_REPO) throw new Error('VERCEL_SITE_TEMPLATE_REPO not set');

  const createRes = await fetch(`${API}/v10/projects${teamQuery()}`, {
    method: 'POST',
    headers: { ...authHeader(), 'content-type': 'application/json' },
    body: JSON.stringify({
      name: opts.projectName,
      framework: 'nextjs',
      gitRepository: { type: 'github', repo: env.VERCEL_SITE_TEMPLATE_REPO },
      environmentVariables: opts.envVars,
      rootDirectory: 'apps/site',
    }),
  });
  if (!createRes.ok) throw new Error(`Vercel project create failed: ${await createRes.text()}`);
  const project = (await createRes.json()) as { id: string };

  const domainRes = await fetch(`${API}/v10/projects/${project.id}/domains${teamQuery()}`, {
    method: 'POST',
    headers: { ...authHeader(), 'content-type': 'application/json' },
    body: JSON.stringify({ name: opts.domain }),
  });
  if (!domainRes.ok) {
    const text = await domainRes.text();
    if (!text.includes('already_in_use')) {
      console.warn('Vercel domain attach warning:', text);
    }
  }

  const deployRes = await fetch(`${API}/v13/deployments${teamQuery()}`, {
    method: 'POST',
    headers: { ...authHeader(), 'content-type': 'application/json' },
    body: JSON.stringify({ name: opts.projectName, project: project.id, target: 'production' }),
  });
  let deploymentUrl = '';
  if (deployRes.ok) {
    const dep = (await deployRes.json()) as { url?: string };
    deploymentUrl = dep.url ?? '';
  }
  return { projectId: project.id, deploymentUrl };
}
