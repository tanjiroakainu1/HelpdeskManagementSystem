export interface ChatRequestBody {
  messages: { role: string; content: string }[];
  systemContext?: string;
}

export type AssistantSuccess = { ok: true; reply: string };
export type AssistantFailure = { ok: false; error: string; status: number };
export type AssistantResult = AssistantSuccess | AssistantFailure;

export function isAssistantFailure(result: AssistantResult): result is AssistantFailure {
  return result.ok === false;
}

function sanitizeProviderError(raw?: string): string {
  if (!raw) return 'Galaxy Guide could not complete that request. Try again.';
  if (/openrouter|provider|api\s*key|bearer|endpoint/i.test(raw)) {
    return 'Galaxy Guide is busy right now. Please try again in a moment.';
  }
  return raw.length > 200 ? `${raw.slice(0, 200)}…` : raw;
}

export function getAssistantEnv() {
  return {
    apiKey: process.env.OPENROUTER_API_KEY ?? '',
    model: process.env.OPENROUTER_MODEL || 'openrouter/free',
  };
}

export async function runAssistantChat(
  body: ChatRequestBody,
  referer: string,
): Promise<AssistantResult> {
  const { apiKey, model } = getAssistantEnv();

  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error:
        'Galaxy Guide is not configured. Set OPENROUTER_API_KEY in your environment (Vercel → Settings → Environment Variables, or local .env).',
    };
  }

  if (!body.messages?.length) {
    return { ok: false, status: 400, error: 'Message is required.' };
  }

  const systemContent = body.systemContext ?? 'You are Galaxy Guide, the Helpdesk Management System assistant.';

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': referer,
        'X-Title': 'Helpdesk Management System',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemContent }, ...body.messages],
        max_tokens: 768,
        temperature: 0.6,
      }),
    });

    const data = (await upstream.json()) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string };
    };

    if (!upstream.ok) {
      return {
        ok: false,
        status: upstream.status >= 500 ? 502 : upstream.status,
        error: sanitizeProviderError(data.error?.message),
      };
    }

    const reply =
      data.choices?.[0]?.message?.content?.trim() ??
      'I could not generate a reply. Please try again.';

    return { ok: true, reply };
  } catch {
    return { ok: false, status: 500, error: 'Galaxy Guide connection error.' };
  }
}

export function resolveReferer(request: Request): string {
  const origin = request.headers.get('origin');
  if (origin) return origin;
  const host = request.headers.get('host');
  if (host) return `https://${host}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://helpdesk-management-system.vercel.app';
}
