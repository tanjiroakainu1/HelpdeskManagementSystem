import { getAssistantEnv } from '../_lib/assistant';

export const config = {
  runtime: 'edge',
};

export default async function handler(): Promise<Response> {
  const { apiKey, model } = getAssistantEnv();
  const configured = Boolean(apiKey);

  return Response.json(
    {
      ok: configured,
      assistant: 'Galaxy Guide',
      model,
      message: configured
        ? 'Ready'
        : 'Set OPENROUTER_API_KEY in Vercel Environment Variables (or local .env)',
    },
    {
      status: configured ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
