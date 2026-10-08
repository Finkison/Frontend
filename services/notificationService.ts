import api from './api';

const notificationService = {
  list: () => api.get('/notifications/').then((res) => res.data),
  create: (payload: { title: string; body: string; type?: string; target_user_id?: string }) =>
    api.post('/notifications/create/', payload).then((res) => res.data),
  markRead: (id: string) =>
    api.patch(`/notifications/${id}/read/`).then((res) => res.data),
  markAllRead: () =>
    api.post('/notifications/mark-all-read/').then((res) => res.data),
};

export default notificationService;
