import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/tasks';

const sanitize = (value) => {
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>/g, '').trim();
  }
  return value;
};

export const taskService = {
  async fetchTasks() {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  async createTask(task) {
    const params = new URLSearchParams();
    Object.entries(task).forEach(([key, value]) => {
      params.append(key, sanitize(String(value)));
    });
    const response = await axios.post(API_BASE_URL, params);
    return response.data;
  },

  async updateTask(id, task) {
    const params = new URLSearchParams();
    Object.entries(task).forEach(([key, value]) => {
      params.append(key, sanitize(String(value)));
    });
    const response = await axios.put(`${API_BASE_URL}/${id}`, params);
    return response.data;
  },

  async deleteTask(id) {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },
};
