import api from '../core/api-client';

export const authService = {
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
  },
  checkUsername: async (username: string) => {
    const { data } = await api.get(`/auth/check-username?username=${username}`);
    return data;
  },
  checkEmail: async (email: string) => {
    const { data } = await api.get(`/auth/check-email?email=${email}`);
    return data;
  },
  register: async (credentials: any) => {
    const { data } = await api.post('/auth/register', credentials);
    return data;
  },
  verifyRegistration: async (payload: any) => {
    const { data } = await api.post('/auth/verify-registration', payload);
    return data;
  }
};
