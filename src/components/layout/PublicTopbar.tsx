import { Link, NavLink } from 'react-router-dom';

export function PublicTopbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `public-topbar-link ${isActive ? 'public-topbar-link--active' : ''}`;

  return (
    <header className="public-topbar">
      <Link to="/" className="public-topbar-brand" aria-label="Helpdesk home">
        <span className="logo-mark logo-mark--sm sm:logo-mark">HD</span>
        <span className="public-topbar-title">
          <span className="public-topbar-title-main">Helpdesk</span>
          <span className="public-topbar-title-sub hidden sm:inline">Management System</span>
        </span>
      </Link>
      <nav className="public-topbar-nav" aria-label="Guest navigation">
        <NavLink to="/" end className={linkClass}>
          <span className="public-topbar-link-icon" aria-hidden>
            🏠
          </span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/login" className={linkClass}>
          Sign in
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) =>
            `public-topbar-cta ${isActive ? 'public-topbar-cta--active' : ''}`
          }
        >
          Register
        </NavLink>
      </nav>
    </header>
  );
}
