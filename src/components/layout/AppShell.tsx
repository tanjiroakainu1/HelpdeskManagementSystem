import { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { DeveloperCredit } from '@/components/layout/DeveloperCredit';
import { MobileNav } from '@/components/layout/MobileNav';
import { NotificationsPanel } from '@/components/NotificationsPanel';
import { HomeButton } from '@/components/ui/HomeButton';
import { useAuth } from '@/context/AuthContext';
import { useDb } from '@/context/DataContext';
import { navIcon } from '@/lib/navIcons';
import { ROLE_CONFIGS, ROLES } from '@/lib/roles';

export function AppShell({ children }: { children: ReactNode; roleKey?: string; activeSlug?: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  useDb();

  if (!user) return null;

  const config = ROLE_CONFIGS.find((r) => r.key === user.role)!;
  const folder = ROLES[user.role].folder;
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell flex min-h-screen min-h-[100dvh] flex-col">
      <header className="app-header app-header-bar relative px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="btn-ghost btn-icon md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="text-lg" aria-hidden>☰</span>
            </button>
            <NavLink
              to={`/${folder}/dashboard`}
              className="flex min-w-0 items-center gap-2 font-semibold text-white transition hover:opacity-90 sm:gap-3"
            >
              <span className="logo-mark logo-mark--sm sm:logo-mark">HD</span>
              <span className="truncate font-display text-sm sm:text-base">
                <span className="hidden min-[400px]:inline">Helpdesk </span>
                <span className="min-[400px]:hidden">HD</span>
                <span className="hidden sm:inline">System</span>
              </span>
            </NavLink>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            <HomeButton />
            <span className="storage-pill hidden lg:inline" title="Data stored in browser localStorage">
              Standalone · localStorage
            </span>
            <span className="role-chip hidden max-w-[7rem] truncate sm:inline lg:max-w-none">{config.label}</span>
            <NotificationsPanel />
            <NavLink
              to={`/${folder}/profile`}
              className="hidden items-center gap-2 rounded-xl border border-transparent px-2 py-1 transition hover:border-candy/25 hover:bg-surface-2/60 md:flex"
              title="My Profile"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-candy-galaxy text-xs font-bold text-canvas shadow-glow"
                aria-hidden
              >
                {initials}
              </span>
              <span className="max-w-[8rem] truncate text-sm text-slate-300 lg:max-w-[10rem]">{user.fullName}</span>
            </NavLink>
            <button
              type="button"
              className="btn-ghost btn-sm max-sm:px-2.5"
              onClick={() => {
                navigate(`/${folder}/dashboard#quick-roles`);
                setMenuOpen(false);
              }}
            >
              <span className="sm:hidden" aria-hidden>⇄</span>
              <span className="hidden sm:inline">Switch role</span>
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm max-sm:px-2.5"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <span className="sm:hidden" aria-hidden>⎋</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        menus={config.menus}
        folder={folder}
        roleLabel={config.label}
      />

      <nav
        className="mobile-nav-rail flex gap-1.5 overflow-x-auto border-b border-candy/10 bg-surface/50 px-2 py-2 backdrop-blur-md md:hidden"
        aria-label="Quick navigation"
      >
        {config.menus.map((m) => (
          <NavLink
            key={m.slug}
            to={`/${folder}/${m.slug}`}
            className={({ isActive }) =>
              `mobile-nav-rail-item shrink-0 ${isActive ? 'mobile-nav-rail-item--active' : ''}`
            }
          >
            <span className="text-sm" aria-hidden>{navIcon(m.slug)}</span>
            <span className="max-w-[5.5rem] truncate">{m.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 min-h-0">
        <aside className="app-sidebar">
          <p className="sidebar-label">Navigation</p>
          <nav className="flex flex-col gap-1">
            {config.menus.map((m) => (
              <NavLink
                key={m.slug}
                to={`/${folder}/${m.slug}`}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link--active' : 'sidebar-link--idle'}`
                }
              >
                <span className="sidebar-link-icon">{navIcon(m.slug)}</span>
                <span className="truncate">{m.label}</span>
              </NavLink>
            ))}
          </nav>
          <DeveloperCredit variant="sidebar" />
        </aside>

        <main className="app-main min-w-0 flex-1 bg-mesh">
          <div className="page-content flex-1">{children}</div>
          <div className="page-content !pt-0">
            <DeveloperCredit variant="footer" />
          </div>
        </main>
      </div>
    </div>
  );
}
