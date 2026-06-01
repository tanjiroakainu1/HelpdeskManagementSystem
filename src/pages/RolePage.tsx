import { Navigate, useParams } from 'react-router-dom';
import { RoleAccessGate } from '@/components/routing/RoleAccessGate';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { ROLE_CONFIGS } from '@/lib/roles';
import { ConnectedPage } from '@/components/ConnectedPage';
import { EmptyState } from '@/components/ui/EmptyState';
import { CrudRecordsPanel } from '@/features/shared/CrudRecordsPanel';
import { SharedEntityDataPanel } from '@/features/shared/SharedEntityDataPanel';
import { PAGE_MAP } from '@/features/pageRegistry';
import { HelpdeskCharts } from '@/components/charts/HelpdeskCharts';
import { getChartLayout } from '@/lib/chartSlugs';
import { CRUD_ENTITY_BY_SLUG, PAGES_WITHOUT_ACTIVITY_PANEL } from '@/lib/crudSlugs';

export default function RolePage() {
  const { roleFolder, slug } = useParams<{ roleFolder: string; slug: string }>();
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const config = ROLE_CONFIGS.find((c) => c.folder === roleFolder);
  if (!config) {
    const own = ROLE_CONFIGS.find((c) => c.key === user.role);
    return <Navigate to={own ? `/${own.folder}/dashboard` : '/login'} replace />;
  }

  const pageSlug = slug ?? 'dashboard';

  if (config.key !== user.role) {
    return (
      <AppShell roleKey={user.role} activeSlug="dashboard">
        <RoleAccessGate requiredRole={config.key} roleFolder={roleFolder!} pageSlug={pageSlug} />
      </AppShell>
    );
  }

  const key = `${roleFolder}/${slug ?? 'dashboard'}`;
  const Page = PAGE_MAP[key];
  if (!Page) {
    return (
      <AppShell roleKey={user.role} activeSlug={slug ?? 'dashboard'}>
        <div className="card">
          <div className="card-body">
            <EmptyState title="Page not found" description={key} icon="🔍" />
          </div>
        </div>
      </AppShell>
    );
  }

  const showActivity = !PAGES_WITHOUT_ACTIVITY_PANEL.has(pageSlug);
  const activityEntity = CRUD_ENTITY_BY_SLUG[pageSlug] ?? 'all';
  const chartLayout = getChartLayout(pageSlug);
  const requesterId = user.role === 'employee' ? user.id : undefined;

  return (
    <AppShell roleKey={user.role} activeSlug={pageSlug}>
      <ConnectedPage component={Page} />
      {chartLayout && (
        <HelpdeskCharts layout={chartLayout} requesterId={requesterId} />
      )}
      {showActivity && activityEntity !== 'all' && (
        <SharedEntityDataPanel entityType={activityEntity} />
      )}
      {showActivity && <CrudRecordsPanel entityType={activityEntity} />}
    </AppShell>
  );
}
