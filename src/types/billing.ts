interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  status: "active" | "canceled" | "paused";
  createdAt: Date;
  updatedAt: Date;
}

interface BillingData {
    name: string;
    status: "active" | "inactive" | "cancelled" | "past_due";
    amount?: number;
}

export type { Subscription, BillingData };
