import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { DeveloperCredit } from '@/components/layout/DeveloperCredit';
import { HomeButton } from '@/components/ui/HomeButton';
import { navIcon } from '@/lib/navIcons';
import type { RoleMenuItem } from '@/types';

export function MobileNav({
  open,
  onClose,
  menus,
  folder,
  roleLabel,
}: {
  open: boolean;
  onClose: () => void;
  menus: RoleMenuItem[];
  folder: string;
  roleLabel: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div
        className={`mobile-nav-backdrop ${open ? 'mobile-nav-backdrop--open' : ''}`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        className={`mobile-nav-drawer ${open ? 'mobile-nav-drawer--open' : ''}`}
        aria-hidden={!open}
        aria-label="Navigation menu"
      >
        <div className="mobile-nav-header">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Menu</p>
            <p className="mt-0.5 text-sm font-medium text-white">{roleLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <HomeButton onClick={onClose} />
            <button type="button" className="btn-ghost btn-sm" onClick={onClose} aria-label="Close menu">
              ✕
            </button>
          </div>
        </div>
        <nav className="mobile-nav-links">
          {menus.map((m) => (
            <NavLink
              key={m.slug}
              to={`/${folder}/${m.slug}`}
              onClick={onClose}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`
              }
            >
              <span className="mobile-nav-link-icon" aria-hidden>
                {navIcon(m.slug)}
              </span>
              <span className="min-w-0 truncate">{m.label}</span>
            </NavLink>
          ))}
        </nav>
        <DeveloperCredit variant="drawer" />
      </aside>
    </>
  );
}
