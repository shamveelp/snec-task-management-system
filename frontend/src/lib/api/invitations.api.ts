import api from './client';

export interface PendingInvitation {
  id: string;
  token: string;
  organizationName: string;
  organizationCategory: string;
  roleName: string;
  createdAt: string;
  expiresAt: string;
}

export const invitationsApi = {
  createInvitation: async (email: string, roleId: string) => {
    const response = await api.post('/invitations', { email, roleId });
    return response.data;
  },

  getMyInvitations: async () => {
    const response = await api.get<PendingInvitation[]>('/invitations/me');
    return response.data;
  },

  acceptInvitation: async (token: string) => {
    const response = await api.post(`/invitations/${token}/accept`);
    return response.data;
  },
};
