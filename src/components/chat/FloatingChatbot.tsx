import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { sendAssistantMessage } from '@/lib/ai/chatApi';
import { getQuickQuestions } from '@/lib/ai/quickQuestions';
import { buildSystemContext } from '@/lib/ai/systemContext';
import type { ChatMessage } from '@/lib/ai/types';
import { useAssistantAudience } from '@/hooks/useAssistantAudience';
import { useChatViewport } from '@/hooks/useChatViewport';
import { useIsMobileChat } from '@/hooks/useMediaQuery';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/lib/roles';

const WELCOME: Record<string, string> = {
  guest:
    'Hi! I’m Galaxy Guide — ask me anything: this helpdesk, demo logins, general knowledge, or everyday questions.',
  default:
    'Hi! I’m Galaxy Guide — ask me anything about your role, tickets, or the world. Try a quick ask below or type your own.',
};

const MAX_HISTORY = 20;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function resizeTextarea(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
}

export function FloatingChatbot() {
  const { user } = useAuth();
  const audience = useAssistantAudience();
  const isMobile = useIsMobileChat();
  const [open, setOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(true);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const keyboardOffset = useChatViewport(open && isMobile);

  const quickQuestions = useMemo(() => getQuickQuestions(audience), [audience]);
  const systemContext = useMemo(
    () => buildSystemContext(audience, user),
    [audience, user],
  );

  const roleLabel = user ? ROLES[user.role].label : 'Guest';

  useEffect(() => {
    setQuickOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('galaxy-chat-open');
    const focusMs = isMobile ? 80 : 150;
    const t = window.setTimeout(() => inputRef.current?.focus(), focusMs);
    return () => {
      document.body.classList.remove('galaxy-chat-open');
      window.clearTimeout(t);
    };
  }, [open, isMobile]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        abortRef.current?.abort();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading, error]);

  useEffect(() => {
    resizeTextarea(inputRef.current);
  }, [input, open]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setError(null);
      setLastFailedPrompt(null);
      const userMsg: ChatMessage = {
        id: uid(),
        role: 'user',
        content: trimmed,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      resizeTextarea(inputRef.current);
      setLoading(true);

      const historySnapshot = [...messages, userMsg].slice(-MAX_HISTORY);

      try {
        const history = historySnapshot.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const reply = await sendAssistantMessage(history, systemContext, controller.signal);
        if (controller.signal.aborted) return;
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: 'assistant',
            content: reply,
            createdAt: Date.now(),
          },
        ]);
      } catch (e) {
        if (controller.signal.aborted) return;
        const msg = e instanceof Error ? e.message : 'Something went wrong.';
        setError(msg);
        setLastFailedPrompt(trimmed);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [loading, messages, systemContext],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setLoading(false);
    setMessages([]);
    setError(null);
    setLastFailedPrompt(null);
  };

  const close = () => {
    abortRef.current?.abort();
    setLoading(false);
    setOpen(false);
  };

  const welcome = audience === 'guest' ? WELCOME.guest : WELCOME.default;

  const panelStyle =
    isMobile && keyboardOffset > 0
      ? { bottom: keyboardOffset, maxHeight: `calc(100dvh - ${keyboardOffset}px - env(safe-area-inset-top, 0px))` }
      : undefined;

  return (
    <div
      className={`galaxy-chat-root ${isMobile ? 'galaxy-chat-root--mobile' : ''}`}
      data-open={open}
    >
      {open && (
        <button
          type="button"
          className="galaxy-chat-backdrop"
          aria-label="Close assistant"
          onClick={close}
        />
      )}

      <div
        className={`galaxy-chat-panel ${open ? 'galaxy-chat-panel--open' : ''} ${
          isMobile ? 'galaxy-chat-panel--sheet' : ''
        }`}
        style={panelStyle}
        role="dialog"
        aria-modal={open}
        aria-label="Galaxy Guide assistant"
        aria-hidden={!open}
      >
        <div className="galaxy-chat-drag-handle" aria-hidden />

        <header className="galaxy-chat-header">
          <div className="galaxy-chat-header-main">
            <span className="galaxy-chat-orb" aria-hidden>
              <span className="galaxy-chat-orb-core">✦</span>
            </span>
            <div className="min-w-0">
              <h2 className="galaxy-chat-title">Galaxy Guide</h2>
              <p className="galaxy-chat-subtitle">
                HD Assistant · <span className="text-candy-mint">{roleLabel}</span>
              </p>
            </div>
          </div>
          <div className="galaxy-chat-header-actions">
            <button
              type="button"
              className="galaxy-chat-icon-btn"
              onClick={clearChat}
              title="Clear chat"
              aria-label="Clear chat"
            >
              ↺
            </button>
            <button type="button" className="galaxy-chat-icon-btn" onClick={close} aria-label="Close">
              ✕
            </button>
          </div>
        </header>

        <div className="galaxy-chat-quick">
          <button
            type="button"
            className="galaxy-chat-quick-toggle"
            onClick={() => setQuickOpen((o) => !o)}
            aria-expanded={quickOpen}
          >
            <span className="galaxy-chat-quick-label">Quick asks</span>
            <span className="galaxy-chat-quick-chevron" aria-hidden>
              {quickOpen ? '▴' : '▾'}
            </span>
          </button>
          {quickOpen && (
            <div className="galaxy-chat-quick-scroll" aria-label="Quick questions">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="galaxy-chat-chip"
                  disabled={loading}
                  onClick={() => void send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={listRef} className="galaxy-chat-messages">
          {messages.length === 0 && !loading && (
            <div className="galaxy-chat-bubble galaxy-chat-bubble--bot">
              <p className="galaxy-chat-md">{welcome}</p>
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`galaxy-chat-bubble ${
                m.role === 'user' ? 'galaxy-chat-bubble--user' : 'galaxy-chat-bubble--bot'
              }`}
            >
              <p className="galaxy-chat-md whitespace-pre-wrap break-words">{m.content}</p>
            </div>
          ))}
          {loading && (
            <div
              className="galaxy-chat-bubble galaxy-chat-bubble--bot galaxy-chat-typing"
              aria-live="polite"
              aria-busy="true"
            >
              <span className="galaxy-chat-typing-text">Thinking</span>
              <span /><span /><span />
            </div>
          )}
          {error && (
            <div className="galaxy-chat-error" role="alert">
              <p>{error}</p>
              {lastFailedPrompt && (
                <button
                  type="button"
                  className="galaxy-chat-retry btn-primary btn-sm mt-2 w-full"
                  onClick={() => void send(lastFailedPrompt)}
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>

        <form className="galaxy-chat-form" onSubmit={onSubmit}>
          <textarea
            ref={inputRef}
            className="galaxy-chat-input"
            rows={1}
            placeholder="Ask Galaxy Guide anything…"
            value={input}
            disabled={loading}
            enterKeyHint="send"
            autoComplete="off"
            autoCorrect="on"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
          />
          <button
            type="submit"
            className="galaxy-chat-send"
            disabled={loading || !input.trim()}
            aria-label="Send"
          >
            ↑
          </button>
        </form>
        <p className="galaxy-chat-foot">HD Intelligence · guidance only</p>
      </div>

      {!open && (
        <button
          type="button"
          className="galaxy-chat-fab"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-label="Open Galaxy Guide"
        >
          <span className="galaxy-chat-fab-icon" aria-hidden>
            ✦
          </span>
          <span className="galaxy-chat-fab-pulse" aria-hidden />
          <span className="galaxy-chat-fab-label">Guide</span>
        </button>
      )}
    </div>
  );
}
