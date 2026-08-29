import api from './client';

export interface TaskCommentData {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; profilePicture: string | null };
}

export interface TaskAttachmentData {
  id: string;
  taskId: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  createdAt: string;
  user: { id: string; name: string; profilePicture: string | null };
}

export interface TaskData {
  id: string;
  title: string;
  description: string | null;
  projectId: string;
  assigneeId: string | null;
  reporterId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  dueDate: string | null;
  estimatedHours: number | null;
  actualHours: number | null;
  createdAt: string;
  assignee?: { id: string; name: string; profilePicture: string | null };
  reporter?: { id: string; name: string; profilePicture: string | null };
  comments?: TaskCommentData[];
  attachments?: TaskAttachmentData[];
  _count?: { comments: number; attachments: number };
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  estimatedHours?: number;
}

// Project role returned from GET /tasks/project/:id/my-role
export type ProjectUserRole = 'ORG_ADMIN' | 'PROJECT_MANAGER' | 'TEAM_LEAD' | 'DEVELOPER' | 'NONE';

export const tasksApi = {
  getTasksByProject: async (projectId: string) => {
    const response = await api.get<TaskData[]>(`/tasks/project/${projectId}`);
    return response.data;
  },

  getTaskById: async (id: string) => {
    const response = await api.get<TaskData>(`/tasks/${id}`);
    return response.data;
  },

  getMyProjectRole: async (projectId: string): Promise<ProjectUserRole> => {
    const response = await api.get<{ role: ProjectUserRole }>(`/tasks/project/${projectId}/my-role`);
    return response.data.role;
  },

  createTask: async (data: CreateTaskPayload) => {
    const response = await api.post<TaskData>('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<CreateTaskPayload> & { actualHours?: number }) => {
    const response = await api.put<TaskData>(`/tasks/${id}`, data);
    return response.data;
  },

  addComment: async (taskId: string, content: string) => {
    const response = await api.post<TaskCommentData>(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  addAttachment: async (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<TaskAttachmentData>(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteAttachment: async (attachmentId: string) => {
    const response = await api.delete(`/tasks/attachments/${attachmentId}`);
    return response.data;
  },
};
