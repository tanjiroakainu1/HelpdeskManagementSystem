import { ROLE_META } from '@/lib/roleMeta';
import { ROLES } from '@/lib/roles';
import { SYSTEM_WORKFLOW, TICKET_STATUS_FLOW } from '@/lib/systemFlow';

export function SystemFlowSection() {
  return (
    <section className="home-section" aria-labelledby="home-flow-heading">
      <div className="home-section-head">
        <span className="home-section-eyebrow">Workflow</span>
        <h2 id="home-flow-heading" className="home-section-title">
          How the system flows
        </h2>
        <p className="home-section-desc">
          One connected journey from request to resolution — ten specialized roles, shared tickets, and a
          single audit trail everyone can see.
        </p>
      </div>

      <div className="home-status-pipeline" aria-label="Ticket status progression">
        {TICKET_STATUS_FLOW.map((status, i) => (
          <span key={status} className="home-status-pipeline-inner">
            <span className="home-status-chip">{status}</span>
            {i < TICKET_STATUS_FLOW.length - 1 && (
              <span className="home-status-arrow" aria-hidden>
                →
              </span>
            )}
          </span>
        ))}
      </div>

      <ol className="home-flow-track">
        {SYSTEM_WORKFLOW.map((item, index) => (
          <li key={item.step} className="home-flow-step">
            <div className="home-flow-step-marker" aria-hidden>
              <span className="home-flow-step-num">{item.step}</span>
              {index < SYSTEM_WORKFLOW.length - 1 && <span className="home-flow-step-line" />}
            </div>
            <div className="home-flow-step-card card">
              <div className="card-body">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <span className="home-flow-step-icon" aria-hidden>
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.roles.map((role) => {
                        const meta = ROLE_META[role];
                        return (
                          <span
                            key={role}
                            className={`home-flow-role-chip bg-gradient-to-r ${meta.gradient}`}
                            title={ROLES[role].label}
                          >
                            <span aria-hidden>{meta.icon}</span>
                            {meta.shortLabel}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
