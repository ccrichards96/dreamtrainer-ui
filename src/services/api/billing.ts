import axios from "axios";
import apiClient, { APIResponse } from "./client";
import { Subscription, BillingData, UserBillingData } from "../../types/billing";

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
  promoCode?: string;
  referralId?: string;  //Referral ID for affliates
}

/**
 * Get all available subscription packages
 * @returns Promise<any[]> - List of available subscription packages
 */
export const getAllProducts = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<APIResponse<any[]>>("/billing/products");
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
 * @returns Promise<UserBillingData> - User's billing and subscription information
 */
export const getUserBillingInfo = async (): Promise<UserBillingData> => {
  try {
    const response = await apiClient.get<APIResponse<UserBillingData>>("/billing/me");
    return response.data.data;
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
 * @returns Promise<{ checkoutUrl: string }> - Checkout session URL
 */
export const createCheckoutSession = async (
  checkoutData: CheckoutSessionRequest,
): Promise<{ checkoutUrl: string }> => {
  try {
    const response = await apiClient.post<APIResponse<{ checkoutUrl: string }>>(
      "/billing/checkout-session",
      checkoutData,
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
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
 * @returns Promise<{ portalUrl: string }> - Billing portal URL
 */
export const generateBillingPortalLink = async (returnUrl: string): Promise<{ portalUrl: string }> => {
  try {
    const response = await apiClient.post<APIResponse<{ portalUrl: string }>>(
      "/billing/portal",
      { returnUrl },
    );
    return response.data.data;
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
 * @returns Promise<BillingData[]> - List of user subscriptions
 */
export const getUserSubscriptions = async (): Promise<BillingData[]> => {
  try {
    const response = await apiClient.get<APIResponse<BillingData[]>>(
      "/billing/subscriptions",
    );
    return response.data.data;
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
