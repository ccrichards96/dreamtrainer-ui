import apiClient from "./client";
import { Subscription, BillingData } from "../../types/billing";

// Billing related interfaces
export interface UserBillingInfo {
  userId: string;
  subscription: Subscription;
}

export interface CheckoutSessionRequest {
  priceIds: string[];
  successUrl: string;
  cancelUrl: string;
  mode?: "payment" | "subscription" | "setup";
}

export interface CheckoutSessionResponse {
  success: boolean;
  data: {
    checkoutUrl: string;
  };
  message: string;
}

export interface BillingPortalResponse {
  success: boolean;
  data: {
    portalUrl: string;
  };
  message: string;
}

export interface GetUserSubscriptionsResponse {
  success: boolean;
  data: BillingData[];
  message: string;
}

/**
 * Get all available subscription packages
 * @returns Promise<any[]> - List of available subscription packages
 */
export const getAllProducts = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<any[]>("/billing/products");
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get products: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching products");
  }
};

/**
 * Get the current user's billing information and subscription details
 * @returns Promise<UserBillingInfo> - User's billing and subscription information
 */
export const getUserBillingInfo = async (): Promise<UserBillingInfo> => {
  try {
    const response = await apiClient.get<UserBillingInfo>("/billing/user");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user billing info: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred while fetching billing information",
    );
  }
};

/**
 * Create a Stripe checkout session
 * @param checkoutData - Checkout session configuration
 * @returns Promise<CheckoutSessionResponse> - Checkout session URL and ID
 */
export const createCheckoutSession = async (
  checkoutData: CheckoutSessionRequest,
): Promise<CheckoutSessionResponse> => {
  try {
    const response = await apiClient.post<CheckoutSessionResponse>(
      "/billing/checkout-session",
      checkoutData,
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred while creating checkout session",
    );
  }
};

/**
 * Generate a Stripe billing portal link for account management
 * @returns Promise<BillingPortalResponse> - Billing portal URL
 */
export const generateBillingPortalLink = async (returnUrl: string): Promise<BillingPortalResponse> => {
  try {
    const response = await apiClient.post<BillingPortalResponse>(
      "/billing/portal",
      { returnUrl },
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate billing portal link: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred while generating billing portal link",
    );
  }
};

/**
 * Get all user subscriptions
 * @returns Promise<GetUserSubscriptionsResponse> - List of user subscriptions
 */
export const getUserSubscriptions = async (): Promise<GetUserSubscriptionsResponse> => {
  try {
    const response = await apiClient.get<GetUserSubscriptionsResponse>(
      "/billing/subscriptions",
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user subscriptions: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred while fetching user subscriptions",
    );
  }
};

// Export all billing-related functions as a service object
export const billingService = {
  getAllProducts,
  getUserBillingInfo,
  createCheckoutSession,
  generateBillingPortalLink,
  getUserSubscriptions,
};

export default billingService;
