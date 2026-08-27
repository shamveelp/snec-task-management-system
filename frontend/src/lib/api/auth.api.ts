import api from './client';

export const authApi = {
  login: async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
  forgotPassword: async (email: string) => {
    await api.post('/auth/forgot-password', { email });
  },
  resetPassword: async (payload: any) => {
    await api.post('/auth/reset-password', payload);
  },
  getProfile: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  }
};
