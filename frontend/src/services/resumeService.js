import api from './api';

export const uploadResume = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('resume', file);

  const { data } = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return data;
};

export const getAnalysis = async (id) => {
  const { data } = await api.get(`/resume/analysis/${id}`);
  return data;
};

export const getHistory = async () => {
  const { data } = await api.get('/resume/history');
  return data;
};

export const deleteResume = async (id) => {
  const { data } = await api.delete(`/resume/${id}`);
  return data;
};

export const getJobMatches = async (resumeId) => {
  const { data } = await api.get(`/jobs/match/${resumeId}`);
  return data;
};

export const getAllJobs = async (params) => {
  const { data } = await api.get('/jobs', { params });
  return data;
};

export const getUserStats = async () => {
  const { data } = await api.get('/user/stats');
  return data;
};

export const updateProfile = async (updates) => {
  const { data } = await api.put('/user/profile', updates);
  return data;
};
