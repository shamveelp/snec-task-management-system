import api from './client';

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface DeveloperSearch {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string | null;
}

export const organizationsApi = {
  getMembers: async () => {
    const response = await api.get<OrganizationMember[]>('/organizations/members');
    return response.data;
  },

  searchDevelopers: async (query: string) => {
    const response = await api.get<DeveloperSearch[]>(`/organizations/search-developers?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getRoles: async () => {
    const response = await api.get<{ id: string; name: string }[]>('/organizations/roles');
    return response.data;
  },
};
