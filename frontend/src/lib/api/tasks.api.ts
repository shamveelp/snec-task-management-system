import api from './client';

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
  _count?: {
    comments: number;
    attachments: number;
  };
}

export interface TaskCommentData {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profilePicture: string | null;
  }
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

export const tasksApi = {
  getTasksByProject: async (projectId: string) => {
    const response = await api.get<TaskData[]>(`/tasks/project/${projectId}`);
    return response.data;
  },

  getTaskById: async (id: string) => {
    const response = await api.get<TaskData>(`/tasks/${id}`);
    return response.data;
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
  }
};
