import api from '../core/api-client';

export interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  organizationId: string;
  createdById: string;
  createdAt: string;
  _count?: {
    members: number;
    tasks: number;
  };
  members?: ProjectMemberData[];
}

export interface ProjectMemberData {
  id: string;
  projectId: string;
  userId: string;
  role: 'PROJECT_MANAGER' | 'TEAM_LEAD' | 'DEVELOPER';
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture: string | null;
  }
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: string;
  status?: string;
  memberIds?: string[];
}

export const projectsService = {
  getOrganizationProjects: async () => {
    const response = await api.get<ProjectData[]>('/projects/organization');
    return response.data;
  },

  getMyProjects: async () => {
    const response = await api.get<ProjectData[]>('/projects/me');
    return response.data;
  },

  getProjectById: async (id: string) => {
    const response = await api.get<ProjectData>(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectPayload) => {
    const response = await api.post<ProjectData>('/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<CreateProjectPayload>) => {
    const response = await api.put<ProjectData>(`/projects/${id}`, data);
    return response.data;
  },

  addMember: async (projectId: string, userId: string, role: string) => {
    const response = await api.post(`/projects/${projectId}/members`, { userId, role });
    return response.data;
  },

  updateMemberRole: async (projectId: string, userId: string, role: string) => {
    const response = await api.put(`/projects/${projectId}/members/${userId}`, { role });
    return response.data;
  },

  removeMember: async (projectId: string, userId: string) => {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  }
};
