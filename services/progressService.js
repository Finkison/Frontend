import api from './api';

const progressService = {
  fetchOverview: () => api.get('/progress/overview/').then((res) => res.data),
};

export default progressService;
