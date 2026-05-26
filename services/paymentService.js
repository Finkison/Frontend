import api from './api';

const paymentService = {
  status: () => api.get('/payments/status/').then((res) => res.data),
  subscribe: (plan) => api.post('/payments/subscribe/', { plan }).then((res) => res.data),
};

export default paymentService;
