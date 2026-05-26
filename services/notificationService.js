import api from './api';

const notificationService = {
  list: () => api.get('/notifications/').then((res) => res.data),
  create: (payload) => api.post('/notifications/create/', payload).then((res) => res.data),
};

export default notificationService;
