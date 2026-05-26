import api from './api';

const questionService = {
  fetchQuestions: (params) => api.get('/questions/list/', { params }).then((res) => res.data),
};

export default questionService;
