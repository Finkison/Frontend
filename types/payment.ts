export type SubscriptionPlanTier = "Monthly Pro" | "Entrance Season Pass" | "Free";

export interface PaymentStatus {
  is_subscribed: boolean;
  isSubscribed?: boolean;
  plan?: string;
  tier: string;
  subscription_tier?: string;
  status?: "active" | "inactive";
  expires_in_days?: number;
  gateway: string;
  gateway_badge?: string;
  supported_methods?: string[];
  supported_gateways?: string[];
  supported_currencies?: string[];
  subscription_expires_at?: string | null;
}

export interface ChapaInitPayload {
  plan_id?: string;
  plan_name?: string;
  amount?: number;
  currency?: string;
}

export interface StudentPaymentPlan {
  id: "monthly" | "season_pass";
  name: string;
  price: number;
  currency: string;
  interval: "month" | "season";
  features: string[];
  popular?: boolean;
}

export interface StudentPlansResponse {
  audience: "student";
  currency: string;
  gateway: string;
  plans: StudentPaymentPlan[];
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
