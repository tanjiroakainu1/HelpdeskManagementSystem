import { Link } from 'react-router-dom';
import { ROLE_META } from '@/lib/roleMeta';
import { DEMO_PASSWORD, ROLE_CONFIGS } from '@/lib/roles';

export function HomeRolesGrid() {
  return (
    <section className="home-section" aria-labelledby="home-roles-heading">
      <div className="home-section-head">
        <span className="home-section-eyebrow">Ten roles</span>
        <h2 id="home-roles-heading" className="home-section-title">
          One platform, every hat
        </h2>
        <p className="home-section-desc">
          Each role gets its own workspace — dashboard, profile, modules, charts, and shared System Records.
          Demo password for all accounts: <code className="text-candy-light">{DEMO_PASSWORD}</code>
        </p>
      </div>

      <div className="home-roles-grid">
        {ROLE_CONFIGS.map((config) => {
          const meta = ROLE_META[config.key];
          return (
            <div key={config.key} className="home-role-card">
              <span
                className={`home-role-icon bg-gradient-to-br ${meta.gradient} ring-1 ${meta.ring}`}
                aria-hidden
              >
                {meta.icon}
              </span>
              <h3 className="mt-3 font-display text-sm font-semibold text-white">{config.label}</h3>
              <p className="mt-1 text-xs text-muted">{config.menus.length} modules + profile</p>
            </div>
          );
        })}
      </div>

      <p className="home-roles-cta mt-6 text-center text-sm text-muted">
        <Link to="/login" className="link-accent font-medium">
          Sign in →
        </Link>{' '}
        use Quick Role Access to jump into any demo role instantly.
      </p>
    </section>
  );
}
