import { Link } from 'react-router-dom';
import { HomeRolesGrid } from '@/components/home/HomeRolesGrid';
import { SystemFlowSection } from '@/components/home/SystemFlowSection';
import { PublicTopbar } from '@/components/layout/PublicTopbar';
import { useAuth } from '@/context/AuthContext';
import { DEVELOPER } from '@/lib/developer';
import { DEMO_PASSWORD, ROLES } from '@/lib/roles';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-shell">
      <div className="home-hero-glow home-hero-glow--emerald" aria-hidden />
      <div className="home-hero-glow home-hero-glow--violet" aria-hidden />
      <div className="home-hero-glow home-hero-glow--center" aria-hidden />

      <PublicTopbar />

      {user && (
        <div className="home-signed-in-banner">
          <p className="text-sm text-slate-300">
            Signed in as <strong className="text-white">{user.fullName}</strong> · {ROLES[user.role].label}
          </p>
          <Link to={`/${ROLES[user.role].folder}/dashboard`} className="btn-primary min-h-[2.75rem] shrink-0 px-6">
            Open dashboard
          </Link>
        </div>
      )}

      <main className="home-main">
        <section className="home-hero-card">
          <div className="home-developer-card">
            <div className="home-developer-glow" aria-hidden />
            <div className="home-developer-inner">
              <span className="home-developer-avatar" aria-hidden>
                {DEVELOPER.initials}
              </span>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-candy-light/90">
                  Created & developed by
                </p>
                <p className="home-developer-name mt-1">{DEVELOPER.name}</p>
                <p className="mt-0.5 text-sm font-medium text-galaxy-dust">{DEVELOPER.role}</p>
              </div>
            </div>
          </div>

          <div className="home-hero-body">
            <p className="home-eyebrow">Enterprise helpdesk platform</p>
            <h1 className="home-title">Helpdesk Management System</h1>
            <p className="home-desc">
              Explore a full ten-role IT helpdesk — tickets, SLA, escalations, knowledge base, QA, audit logs,
              live charts, and <strong>Galaxy Guide</strong> AI.
            </p>

            {!user && (
              <div className="home-hero-actions">
                <Link to="/login" className="btn-primary home-cta-primary">
                  Sign in & try demo roles
                </Link>
                <Link to="/register" className="btn-ghost home-cta-secondary">
                  Register as employee
                </Link>
              </div>
            )}

            <div className="home-demo-strip">
              <span className="home-demo-strip-label">Demo password (all roles)</span>
              <code>{DEMO_PASSWORD}</code>
              <span className="home-demo-strip-dot hidden sm:inline" aria-hidden>
                ·
              </span>
              <span className="text-candy-mint">Galaxy Guide answers anything</span>
            </div>
          </div>
        </section>

        <div className="home-highlights">
          {[
            { icon: '🎫', title: 'Tickets & SLA', text: 'Priorities, assignments, breaches' },
            { icon: '📊', title: 'Live analytics', text: 'Charts on every dashboard' },
            { icon: '🗂', title: 'System Records', text: 'Shared CRUD log for all roles' },
            { icon: '👤', title: 'My Profile', text: 'Role guide on every workspace' },
          ].map((h) => (
            <div key={h.title} className="home-highlight-card">
              <span className="text-xl" aria-hidden>
                {h.icon}
              </span>
              <div>
                <p className="font-semibold text-white">{h.title}</p>
                <p className="text-xs text-muted">{h.text}</p>
              </div>
            </div>
          ))}
        </div>

        <SystemFlowSection />
        <HomeRolesGrid />

        {!user && (
          <section className="home-cta card">
            <div className="card-body home-cta-body">
              <p className="home-cta-eyebrow">Get started in seconds</p>
              <h2 className="home-cta-title">Ready to explore the full workflow?</h2>
              <p className="home-cta-desc">
                Built by <span className="font-semibold text-candy-mint">{DEVELOPER.name}</span> — pick any
                demo role on sign-in and walk through the helpdesk end to end.
              </p>
              <div className="home-cta-actions">
                <Link to="/login" className="btn-primary home-cta-primary">
                  Go to sign in
                </Link>
                <Link to="/register" className="btn-ghost home-cta-secondary">
                  Create account
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="home-footer">
        <p>
          © {new Date().getFullYear()} Helpdesk Management System · Developed by{' '}
          <span className="text-candy-mint">{DEVELOPER.name}</span>
        </p>
      </footer>
    </div>
  );
}
