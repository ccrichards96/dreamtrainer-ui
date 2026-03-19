interface Subscription {
  id: string;
  userId?: string;
  stripeSubscriptionId?: string;
  name: string;
  status: "active" | "canceled" | "paused" | "inactive" | "cancelled" | "past_due";
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SubscriptionStatus {
  status: string;
  hasActiveSubscription: boolean;
  canAccessProduct: boolean;
  totalSubscriptions: number;
  activeSubscriptionsCount: number;
}

interface UserBillingData {
  subscription: Subscription;
  subscriptionStatus: SubscriptionStatus;
}

interface BillingData {
  name: string;
  status: "active" | "inactive" | "cancelled" | "past_due";
  amount?: number;
}

/**
 * Course pricing information from Stripe
 */
interface CoursePricing {
  priceId: string;
  amount: number; // In dollars (converted from cents)
  currency: string;
  type: "one_time" | "recurring";
  recurring?: {
    interval: string; // 'month', 'year', etc.
    intervalCount: number;
  };
}

export type { Subscription, BillingData, SubscriptionStatus, UserBillingData, CoursePricing };
