import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

const ASSISTANT_CHAT = '/api/assistant/chat';
const ASSISTANT_HEALTH = '/api/assistant/health';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/** Proxies chat to the AI provider — API key stays on the server, never in the client bundle. */
function assistantProxyPlugin(env: Record<string, string>): Plugin {
  const handler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url?.split('?')[0] ?? '';

    if (url === ASSISTANT_HEALTH && req.method === 'GET') {
      const configured = Boolean(env.OPENROUTER_API_KEY);
      res.statusCode = configured ? 200 : 503;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          ok: configured,
          assistant: 'Galaxy Guide',
          model: env.OPENROUTER_MODEL || 'openrouter/free',
          message: configured ? 'Ready' : 'Add OPENROUTER_API_KEY to .env',
        }),
      );
      return;
    }

    if (url !== ASSISTANT_CHAT || req.method !== 'POST') {
      next();
      return;
    }

    const apiKey = env.OPENROUTER_API_KEY;
    if (!apiKey) {
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Galaxy Guide is not configured. Add OPENROUTER_API_KEY to .env' }));
      return;
    }

    try {
      const raw = await readBody(req);
      const body = JSON.parse(raw) as {
        messages: { role: string; content: string }[];
        systemContext?: string;
      };

      const model = env.OPENROUTER_MODEL || 'openrouter/free';
      const systemContent = body.systemContext ?? 'You are the Helpdesk Galaxy Guide assistant.';

      const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
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
        let errMsg = data.error?.message ?? 'Galaxy Guide could not complete that request. Try again.';
        if (/openrouter|provider|api\s*key/i.test(errMsg)) {
          errMsg = 'Galaxy Guide is busy right now. Please try again in a moment.';
        }
        res.statusCode = upstream.status >= 500 ? 502 : upstream.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: errMsg }));
        return;
      }

      const reply = data.choices?.[0]?.message?.content?.trim() ?? 'I could not generate a reply. Please try again.';

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ reply }));
    } catch (e) {
      console.error('[assistant-proxy]', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Assistant connection error.' }));
    }
  };

  return {
    name: 'hd-assistant-proxy',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), assistantProxyPlugin(env)],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    base: './',
    server: {
      port: 5173,
      strictPort: false,
      open: true,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  };
});
