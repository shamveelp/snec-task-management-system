import api from '../core/api-client';

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface OrganizationData {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  createdAt: string;
}

export interface DeveloperSearch {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string | null;
}

export interface OrganizationInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export const organizationsService = {
  getMembers: async () => {
    const response = await api.get<OrganizationMember[]>('/organization/profile/members');
    return response.data;
  },

  getInvitations: async () => {
    const response = await api.get<OrganizationInvitation[]>('/organization/profile/invitations');
    return response.data;
  },

  searchDevelopers: async (query: string) => {
    const response = await api.get<DeveloperSearch[]>(`/organization/profile/search-developers?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getRoles: async () => {
    const response = await api.get<{ id: string; name: string }[]>('/organization/profile/roles');
    return response.data;
  },

  getJoinedOrganizations: async () => {
    const response = await api.get<OrganizationData[]>('/organization/profile/joined');
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get<any[]>('/organization/profile/notifications');
    return response.data;
  }
};
