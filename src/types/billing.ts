interface Subscription {
  id: string;
  userId: string;
  stripeProductId: string;
  status: "active" | "canceled" | "paused";
  createdAt: Date;
  updatedAt: Date;
}

export type { Subscription };
