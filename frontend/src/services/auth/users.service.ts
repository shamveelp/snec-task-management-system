import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add interceptor to attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const usersService = {
  updateProfile: async (data: { name?: string; username?: string; mobile?: string; bio?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  checkUsername: async (username: string) => {
    const response = await api.get(`/users/check-username?username=${encodeURIComponent(username)}`);
    return response.data;
  },

  updateProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/users/profile-picture', formData);
    return response.data;
  },
};
