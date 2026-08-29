import api from '../core/api-client';

export interface PendingInvitation {
  id: string;
  token: string;
  organizationName: string;
  organizationCategory: string;
  roleName: string;
  createdAt: string;
  expiresAt: string;
}

export const invitationsService = {
  createInvitation: async (email: string, roleId: string) => {
    const response = await api.post('/organization/invitations', { email, roleId });
    return response.data;
  },

  getMyInvitations: async () => {
    const response = await api.get<PendingInvitation[]>('/organization/invitations/me');
    return response.data;
  },

  acceptInvitation: async (token: string) => {
    const response = await api.post(`/organization/invitations/${token}/accept`);
    return response.data;
  },
};
