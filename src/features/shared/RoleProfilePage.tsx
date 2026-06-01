import { Link, Navigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { DEMO_PASSWORD, ROLES, ROLE_CONFIGS } from '@/lib/roles';
import { getRoleProfile } from '@/lib/roleProfiles';
import { ROLE_META } from '@/lib/roleMeta';
import { navIcon } from '@/lib/navIcons';
import type { UserRole } from '@/types';

export function RoleProfilePage({ role }: { role: UserRole }) {
  const { user } = useAuth();
  const db = useAppDb();
  const profile = getRoleProfile(role);
  const meta = ROLE_META[role];
  const folder = ROLES[role].folder;
  const config = ROLE_CONFIGS.find((r) => r.key === role)!;

  if (user && user.role !== role) {
    return <Navigate to={`/${ROLES[user.role].folder}/profile`} replace />;
  }

  const sessionUser = user?.role === role ? user : db.users.find((u) => u.email === profile.demoAccountEmail);
  const department =
    sessionUser?.departmentId != null
      ? db.departments.find((d) => d.id === sessionUser.departmentId)?.name
      : null;

  const moduleLinks = config.menus.filter((m) => !['dashboard', 'profile', 'system-records'].includes(m.slug));

  return (
    <>
      <PageHeader
        title="My Profile"
        description={`${profile.title} — role overview, access, and workspace modules.`}
      />

      <div className="profile-hero card mb-6">
        <div className="profile-hero-glow profile-hero-glow--emerald" aria-hidden />
        <div className="profile-hero-glow profile-hero-glow--violet" aria-hidden />
        <div className="card-body relative z-[1]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span
              className={`profile-avatar bg-gradient-to-br ${meta.gradient} ring-2 ${meta.ring}`}
              aria-hidden
            >
              {meta.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-candy-light/90">{ROLES[role].label}</p>
              <h2 className="profile-hero-name mt-1">{profile.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{profile.summary}</p>
              {sessionUser && (
                <div className="profile-session mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="profile-session-item">
                    <span className="profile-session-label">Signed in as</span>
                    <span className="profile-session-value">{sessionUser.fullName}</span>
                  </div>
                  <div className="profile-session-item">
                    <span className="profile-session-label">Email</span>
                    <span className="profile-session-value font-mono text-sm">{sessionUser.email}</span>
                  </div>
                  {department && (
                    <div className="profile-session-item">
                      <span className="profile-session-label">Department</span>
                      <span className="profile-session-value">{department}</span>
                    </div>
                  )}
                  <div className="profile-session-item">
                    <span className="profile-session-label">Status</span>
                    <span className="profile-session-value text-candy-mint">
                      {sessionUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-grid mb-6">
        <div className="card profile-card">
          <div className="card-header">
            <h2>Mission</h2>
          </div>
          <div className="card-body">
            <p className="text-sm leading-relaxed text-slate-300">{profile.mission}</p>
            <dl className="profile-meta mt-4 space-y-2 text-sm">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="text-muted shrink-0">Reports to</dt>
                <dd className="font-medium text-slate-200">{profile.reportsTo}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="text-muted shrink-0">Collaborates with</dt>
                <dd className="text-slate-300">{profile.collaboratesWith.join(' · ')}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="card profile-card">
          <div className="card-header">
            <h2>Demo access</h2>
          </div>
          <div className="card-body space-y-2 text-sm">
            <p className="text-muted">Quick-login credentials for this role:</p>
            <p>
              <span className="text-muted">Email </span>
              <code className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-candy-light">
                {profile.demoAccountEmail}
              </code>
            </p>
            <p>
              <span className="text-muted">Password </span>
              <code className="rounded-md bg-candy/15 px-2 py-0.5 font-mono text-candy-light">{DEMO_PASSWORD}</code>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileListCard title="Key responsibilities" items={profile.responsibilities} icon="✦" />
        <ProfileListCard title="Permissions & access" items={profile.permissions} icon="🔐" />
        <ProfileListCard title="Typical workflows" items={profile.workflows} icon="↻" />
        <ProfileListCard title="Success metrics (KPIs)" items={profile.kpis} icon="📈" />
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <h2>Your modules</h2>
          <Link to={`/${folder}/dashboard`} className="link-accent text-sm">
            Dashboard →
          </Link>
        </div>
        <div className="card-body">
          <div className="nav-pill-grid">
            {moduleLinks.map((m) => (
              <Link key={m.slug} to={`/${folder}/${m.slug}`} className="nav-pill w-full sm:w-auto">
                <span className="nav-pill-icon" aria-hidden>
                  {navIcon(m.slug)}
                </span>
                <span className="truncate">{m.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileListCard({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: string;
}) {
  return (
    <div className="card profile-card h-full">
      <div className="card-header">
        <h2>
          <span className="mr-2 opacity-80" aria-hidden>
            {icon}
          </span>
          {title}
        </h2>
      </div>
      <div className="card-body">
        <ul className="profile-list space-y-2.5">
          {items.map((item) => (
            <li key={item} className="profile-list-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
