import api from './api';
import type {
  PaymentStatus,
  ChapaInitPayload,
  ChapaInitResponse,
  ChapaVerifyResponse
} from '../types/payment';

export type {
  PaymentStatus,
  ChapaInitPayload,
  ChapaInitResponse,
  ChapaVerifyResponse
};

const paymentService = {
  
  status: async (): Promise<PaymentStatus> => {
    const res = await api.get('/payments/status/');
    return res.data;
  },

  initializeChapa: async (payload: ChapaInitPayload): Promise<ChapaInitResponse> => {
    const res = await api.post('/payments/chapa/initialize/', payload);
    return res.data;
  },

  verifyChapa: async (tx_ref: string): Promise<ChapaVerifyResponse> => {
    const res = await api.get(`/payments/chapa/verify/${tx_ref}/`);
    return res.data;
  },

  subscribe: async (plan: string): Promise<ChapaInitResponse> => {
    const res = await api.post('/payments/subscribe/', { plan });
    return res.data;
  },
};

export default paymentService;
