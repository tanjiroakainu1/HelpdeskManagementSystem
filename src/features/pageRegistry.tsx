import type { ComponentType } from 'react';
import SystemRecordsPage from '@/features/shared/SystemRecordsPage';
import { ROLE_CONFIGS } from '@/lib/roles';
import { pageMap as superAdmin } from '@/roles/super-admin';
import { pageMap as helpDeskManager } from '@/roles/help-desk-manager';
import { pageMap as supportSupervisor } from '@/roles/support-supervisor';
import { pageMap as supportAgent } from '@/roles/support-agent';
import { pageMap as itTechnician } from '@/roles/it-technician';
import { pageMap as departmentHead } from '@/roles/department-head';
import { pageMap as employeeCustomer } from '@/roles/employee-customer';
import { pageMap as knowledgeBaseEditor } from '@/roles/knowledge-base-editor';
import { pageMap as qualityAssuranceOfficer } from '@/roles/quality-assurance-officer';
import { pageMap as systemAuditor } from '@/roles/system-auditor';

const sharedSystemRecords = Object.fromEntries(
  ROLE_CONFIGS.map((c) => [`${c.folder}/system-records`, SystemRecordsPage]),
);

export const PAGE_MAP: Record<string, ComponentType> = {
  ...sharedSystemRecords,
  ...superAdmin,
  ...helpDeskManager,
  ...supportSupervisor,
  ...supportAgent,
  ...itTechnician,
  ...departmentHead,
  ...employeeCustomer,
  ...knowledgeBaseEditor,
  ...qualityAssuranceOfficer,
  ...systemAuditor,
};

export function resolvePage(folder: string, slug: string): ComponentType {
  return PAGE_MAP[`${folder}/${slug}`] ?? (() => (
    <p className="text-muted">Page not found: {folder}/{slug}</p>
  ));
}
