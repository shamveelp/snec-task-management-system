import api from '../core/api-client';

export interface AuditLogData {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
}

export const auditLogsService = {
  getLogs: async (skip: number = 0, take: number = 50): Promise<AuditLogData[]> => {
    const response = await api.get<AuditLogData[]>(`/organization/audit-logs`, {
      params: { skip, take }
    });
    return response.data;
  },
};
