import { PageHeader } from '@/components/ui/PageHeader';
import { ROLE_CONFIGS } from '@/lib/roles';

export default function Permissions() {
  return (
    <>
      <PageHeader title="Permissions Matrix" />
      <div className="card">
        <div className="card-body space-y-2 text-sm">
          {ROLE_CONFIGS.map((r) => (
            <p key={r.key}>
              <strong>{r.label}:</strong> {r.menus.map((m) => m.label).join(', ')}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
