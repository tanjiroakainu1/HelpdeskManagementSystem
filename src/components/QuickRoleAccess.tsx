import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, ROLES, ROLE_CONFIGS } from '@/lib/roles';
import { ROLE_META } from '@/lib/roleMeta';
import type { UserRole } from '@/types';

export function QuickRoleAccess({ variant = 'dashboard' }: { variant?: 'login' | 'register' | 'dashboard' }) {
  const { loginAsRole, user } = useAuth();
  const navigate = useNavigate();
  const isAuthPage = variant === 'login' || variant === 'register';

  const accounts = ROLE_CONFIGS.map((r) => ({
    role: r.key,
    label: r.label,
    email: DEMO_ACCOUNTS[r.key],
    meta: ROLE_META[r.key],
  }));

  const handleClick = (role: UserRole) => {
    if (isAuthPage) {
      loginAsRole(role);
      navigate(`/${ROLES[role].folder}/dashboard`);
    } else if (user?.role !== role) {
      loginAsRole(role);
      navigate(`/${ROLES[role].folder}/dashboard`);
    }
  };

  return (
    <section
      className={`quick-roles-panel ${isAuthPage ? 'quick-roles-panel--auth' : 'quick-roles-panel--dashboard'}`}
      id="quick-roles"
    >
      <div className="quick-roles-header">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white">Quick role access</h3>
          <p className="mt-0.5 text-xs text-muted">One click — demo account loads instantly</p>
        </div>
        <div className="demo-badge w-full sm:w-auto">
          <span className="text-muted">Password</span>
          <code>{DEMO_PASSWORD}</code>
        </div>
      </div>

      <div className={isAuthPage ? 'quick-roles-list' : 'quick-roles-grid'}>
        {accounts.map((a) => {
          const active = variant === 'dashboard' && user?.role === a.role;
          return (
            <button
              key={a.role}
              type="button"
              disabled={active}
              onClick={() => handleClick(a.role)}
              className={`quick-role-card group touch-manipulation ${active ? 'quick-role-card--active' : ''}`}
              title={`${a.label} — ${a.email}`}
            >
              <span
                className={`quick-role-icon bg-gradient-to-br ${a.meta.gradient} ${active ? `ring-2 ${a.meta.ring}` : ''}`}
                aria-hidden
              >
                {a.meta.icon}
              </span>
              <span className="quick-role-body">
                <span className="quick-role-title">{a.meta.shortLabel}</span>
                <span className="quick-role-email">{a.email}</span>
              </span>
              {active ? (
                <span className="quick-role-badge">Active</span>
              ) : (
                <span className="quick-role-arrow" aria-hidden>
                  →
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
