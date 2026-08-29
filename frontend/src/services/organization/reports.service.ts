import api from '../core/api-client';

export interface ProjectProgressData {
  projectId: string;
  projectName: string;
  status: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
}

export interface UserProductivityData {
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  tasksCompleted: number;
  tasksAssigned: number;
  completionRate: number;
}

export interface TaskCompletionStatsData {
  TODO: number;
  IN_PROGRESS: number;
  IN_REVIEW: number;
  DONE: number;
  TOTAL: number;
}

export interface OverdueTaskData {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  assignee?: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  project: {
    id: string;
    name: string;
  };
}

export const reportsService = {
  getProjectProgress: async (): Promise<ProjectProgressData[]> => {
    const response = await api.get<ProjectProgressData[]>(`/organization/reports/project-progress`);
    return response.data;
  },

  getUserProductivity: async (): Promise<UserProductivityData[]> => {
    const response = await api.get<UserProductivityData[]>(`/organization/reports/user-productivity`);
    return response.data;
  },

  getTaskCompletion: async (): Promise<TaskCompletionStatsData> => {
    const response = await api.get<TaskCompletionStatsData>(`/organization/reports/task-completion`);
    return response.data;
  },

  getOverdueTasks: async (): Promise<OverdueTaskData[]> => {
    const response = await api.get<OverdueTaskData[]>(`/organization/reports/overdue-tasks`);
    return response.data;
  }
};
