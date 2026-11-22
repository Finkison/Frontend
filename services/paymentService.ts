import api from './api';
import type {
  PaymentStatus,
  ChapaInitPayload,
  ChapaInitResponse,
  ChapaVerifyResponse,
  StudentPaymentPlan,
  StudentPlansResponse,
} from '../types/payment';

export type {
  PaymentStatus,
  ChapaInitPayload,
  ChapaInitResponse,
  ChapaVerifyResponse,
  StudentPaymentPlan,
  StudentPlansResponse,
};

const paymentService = {

  status: async (): Promise<PaymentStatus> => {
    const res = await api.get('/payments/status/');
    return res.data;
  },

  plans: async (currency = 'ETB'): Promise<StudentPlansResponse> => {
    const res = await api.get('/payments/plans/', { params: { currency } });
    return res.data;
  },

  initializeChapa: async (payload: ChapaInitPayload): Promise<ChapaInitResponse> => {
    const res = await api.post('/payments/chapa/initialize/', payload);
    return res.data;
  },

  verifyTransaction: async (tx_ref: string): Promise<ChapaVerifyResponse> => {
    const res = await api.get(`/payments/chapa/verify/${tx_ref}/`);
    return res.data;
  },

  subscribe: async (planId: string, currency = 'ETB'): Promise<ChapaInitResponse> => {
    const res = await api.post('/payments/subscribe/', { plan_id: planId, currency });
    return res.data;
  },
};

export default paymentService;
