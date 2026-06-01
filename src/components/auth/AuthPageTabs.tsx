import { NavLink } from 'react-router-dom';

export function AuthPageTabs({ active }: { active: 'login' | 'register' }) {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `auth-page-tab ${isActive ? 'auth-page-tab--active' : ''}`;

  return (
    <div className="auth-page-tabs" role="tablist" aria-label="Authentication">
      <NavLink to="/login" className={tabClass} role="tab" aria-selected={active === 'login'}>
        Sign in
      </NavLink>
      <NavLink to="/register" className={tabClass} role="tab" aria-selected={active === 'register'}>
        Create account
      </NavLink>
    </div>
  );
}
