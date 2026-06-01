import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/hooks/useAppDb';
import { api } from '@/lib/api';

export function NotificationsPanel() {
  const { user } = useAuth();
  const { db, refresh } = useAppData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const notifications = db.notifications.filter((n) => n.userId === user.id).slice(0, 20);
  const unread = notifications.filter((n) => !n.isRead).length;

  const openNotification = (id: number, link: string) => {
    api.markNotificationRead(id);
    refresh();
    setOpen(false);
    const path = link.startsWith('/') ? link : `/${link}`;
    navigate(path);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="btn-ghost btn-sm relative gap-1.5"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <span aria-hidden>🔔</span>
        <span className="hidden sm:inline">Alerts</span>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="notifications-panel">
            <div className="flex items-center justify-between border-b border-candy/15 bg-gradient-to-r from-surface-2/80 to-galaxy/10 px-4 py-3.5">
              <span className="font-display font-semibold text-white">Notifications</span>
              {unread > 0 && (
                <button
                  type="button"
                  className="text-xs font-medium text-accent-soft hover:text-white"
                  onClick={() => {
                    api.markAllNotificationsRead(user.id);
                    refresh();
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>
            <ul className="max-h-[min(60dvh,20rem)] overflow-y-auto sm:max-h-80">
              {notifications.length === 0 && (
                <li>
                  <EmptyState title="All caught up" description="No notifications right now." icon="✨" />
                </li>
              )}
              {notifications.map((n) => (
                <li key={n.id} className="border-b border-border/40 last:border-0">
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left transition hover:bg-surface-2/80 ${
                      !n.isRead ? 'border-l-2 border-l-candy bg-candy/5' : ''
                    }`}
                    onClick={() => openNotification(n.id, n.link)}
                  >
                    <p className="text-sm font-medium text-white">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{n.message}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted/80">{n.createdAt.slice(0, 16)}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
