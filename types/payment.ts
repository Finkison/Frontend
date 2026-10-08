export type SubscriptionPlanTier = "Monthly Pro Pass" | "Entrance Season Pass" | "Free";

export interface PaymentStatus {
  is_subscribed: boolean;
  isSubscribed?: boolean;
  plan: string;
  tier: string;
  status: "active" | "inactive";
  expires_in_days: number;
  gateway: string;
  gateway_badge: string;
  supported_methods: string[];
}

export interface ChapaInitPayload {
  plan_name: string;
  amount: number;
  return_url?: string;
  student_id?: string;
}

export interface ChapaInitResponse {
  success: boolean;
  tx_ref: string;
  checkout_url: string;
  status: string;
  error?: string;
}

export interface ChapaVerifyResponse {
  success: boolean;
  status: "SUCCESS" | "FAILED" | "PENDING";
  message?: string;
  tx_ref?: string;
  plan_name?: string;
  expires_at?: string;
  error?: string;
}
