import type { ChatMessage } from '@/lib/ai/types';

const CHAT_ENDPOINT = '/api/assistant/chat';
const REQUEST_TIMEOUT_MS = 90_000;

export async function sendAssistantMessage(
  history: Pick<ChatMessage, 'role' | 'content'>[],
  systemContext: string,
  signal?: AbortSignal,
): Promise<string> {
  const messages = history.map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const timeout =
    typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      : undefined;

  const combined =
    signal && timeout
      ? AbortSignal.any([signal, timeout])
      : signal ?? timeout;

  let res: Response;
  try {
    res = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemContext }),
      signal: combined,
    });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('Request cancelled.');
    }
    if (e instanceof Error && e.name === 'TimeoutError') {
      throw new Error('Galaxy Guide took too long. Try a shorter question or tap Retry.');
    }
    throw new Error(
      'Cannot reach Galaxy Guide. Use npm run dev locally, or deploy to Vercel with OPENROUTER_API_KEY set.',
    );
  }

  let data: { reply?: string; error?: string };
  try {
    data = (await res.json()) as { reply?: string; error?: string };
  } catch {
    throw new Error('Galaxy Guide returned an invalid response. Please try again.');
  }

  if (!res.ok) {
    throw new Error(sanitizeAssistantError(data.error));
  }

  return data.reply?.trim() || 'No response received.';
}

function sanitizeAssistantError(raw?: string): string {
  if (!raw) return 'Galaxy Guide is temporarily unavailable. Please try again.';
  if (/openrouter|api\s*key|bearer|endpoint/i.test(raw)) {
    return 'Galaxy Guide is temporarily unavailable. Please try again in a moment.';
  }
  return raw.length > 200 ? `${raw.slice(0, 200)}…` : raw;
}
