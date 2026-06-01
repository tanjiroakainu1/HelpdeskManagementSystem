import {
  isAssistantFailure,
  runAssistantChat,
  resolveReferer,
  type ChatRequestBody,
} from '../_lib/assistant.js';

export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1'],
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400, headers: corsHeaders });
  }

  const result = await runAssistantChat(body, resolveReferer(request));

  if (isAssistantFailure(result)) {
    return Response.json({ error: result.error }, { status: result.status, headers: corsHeaders });
  }

  return Response.json(
    { reply: result.reply },
    {
      status: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-store',
      },
    },
  );
}
