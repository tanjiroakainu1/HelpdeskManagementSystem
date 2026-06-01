import { ReactNode } from 'react';
import { DeveloperCredit } from '@/components/layout/DeveloperCredit';
import { PublicTopbar } from '@/components/layout/PublicTopbar';
import { AuthPageTabs } from '@/components/auth/AuthPageTabs';
import { AuthPageFooter } from '@/components/auth/AuthPageFooter';

export function AuthLayout({
  children,
  page,
  title,
  subtitle,
  wide = false,
}: {
  children: ReactNode;
  page: 'login' | 'register';
  title: string;
  subtitle?: string;
  wide?: boolean;
}) {
  return (
    <div className="auth-shell">
      <PublicTopbar />

      <div className="auth-body">
        <aside className="auth-hero" aria-label="Product overview">
          <div className="auth-hero-glow auth-hero-glow--emerald" aria-hidden />
          <div className="auth-hero-glow auth-hero-glow--violet" aria-hidden />
          <div className="auth-hero-inner">
            <div>
              <div className="logo-mark mb-6 animate-float shadow-galaxy lg:mb-8">HD</div>
              <p className="auth-hero-eyebrow">IT service management</p>
              <h1 className="auth-hero-title mt-2 max-w-lg text-3xl font-display font-bold leading-[1.1] tracking-tight xl:text-5xl">
                Your enterprise helpdesk
              </h1>
              <p className="auth-hero-lead mt-4 max-w-md text-base leading-relaxed text-galaxy-dust/95 sm:text-lg">
                Ten roles, one shared workflow — tickets, SLA, knowledge base, QA reviews, and audit trails
                kept in sync across the system.
              </p>
            </div>
            <ul className="auth-hero-features">
              {[
                { icon: '🎫', text: 'Tickets & SLA tracking' },
                { icon: '✦', text: 'Galaxy Guide AI assistant' },
                { icon: '🗂', text: 'Shared system records' },
                { icon: '📊', text: 'Live charts on every role' },
              ].map((f) => (
                <li key={f.text} className="glass-chip">
                  <span className="text-lg" aria-hidden>
                    {f.icon}
                  </span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
            <DeveloperCredit variant="hero" />
          </div>
        </aside>

        <div className={`auth-panel ${wide ? 'auth-panel--wide' : ''}`}>
          <div className={`auth-card ${wide ? 'auth-card--wide' : ''}`}>
            <div className="auth-card-intro">
              <AuthPageTabs active={page} />
              <h2 className="auth-card-title">{title}</h2>
              {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
            </div>
            <div className="auth-card-content">{children}</div>
            <div className="auth-card-footer">
              <AuthPageFooter page={page} />
            </div>
          </div>
          <DeveloperCredit variant="auth" />
        </div>
      </div>
    </div>
  );
}
