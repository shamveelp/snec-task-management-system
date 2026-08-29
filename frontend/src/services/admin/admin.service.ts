import api from '../core/api-client';

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  status: string;
  profilePicture: string | null;
  role: { id: string; name: string } | null;
  createdAt: string;
}

export interface AdminOrganizationData {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  category: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminService = {
  getUsers: async (params: { query?: string; roleId?: string; status?: string; page?: number; limit?: number }) => {
    const { data } = await api.get<PaginatedResponse<AdminUserData>>('/admin/users', { params });
    return data;
  },

  createUser: async (payload: any) => {
    const { data } = await api.post<AdminUserData>('/admin/users', payload);
    return data;
  },

  updateUser: async (id: string, payload: any) => {
    const { data } = await api.put<AdminUserData>(`/admin/users/${id}`, payload);
    return data;
  },

  updateUserStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/admin/users/${id}/status`, { status });
    return data;
  },

  deleteUser: async (id: string) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  getOrganizations: async (params: { query?: string; page?: number; limit?: number }) => {
    const { data } = await api.get<PaginatedResponse<AdminOrganizationData>>('/admin/organizations', { params });
    return data;
  },
};
