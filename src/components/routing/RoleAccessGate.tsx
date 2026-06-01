import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/lib/roles';
import { rolePath } from '@/lib/routes';
import type { UserRole } from '@/types';

export function RoleAccessGate({
  requiredRole,
  roleFolder,
  pageSlug,
}: {
  requiredRole: UserRole;
  roleFolder: string;
  pageSlug: string;
}) {
  const { user, loginAsRole } = useAuth();
  const navigate = useNavigate();
  const required = ROLES[requiredRole];

  if (!user) return null;

  const switchRole = () => {
    loginAsRole(requiredRole);
    navigate(rolePath(roleFolder, pageSlug), { replace: true });
  };

  return (
    <div className="card">
      <div className="card-body space-y-4 max-w-lg">
        <PageHeader
          title="Switch role to open this page"
          description={`"${required.label}" pages require that demo account. You are signed in as ${ROLES[user.role].label}.`}
        />
        <p className="text-sm text-muted">
          Use <strong>Quick role access</strong> on the dashboard, or continue below to open this page as{' '}
          {required.label}.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={switchRole}>
            Continue as {required.label}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(rolePath(ROLES[user.role].folder, 'dashboard'))}
          >
            Back to my dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
