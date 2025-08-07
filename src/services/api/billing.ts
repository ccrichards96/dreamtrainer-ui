import apiClient from './client';
import { Subscription } from '../../types/billing';

// Billing related interfaces
export interface UserBillingInfo {
  userId: string;
  subscription: Subscription
}

export interface CheckoutSessionRequest {
  priceIds: string[];
  successUrl: string;
  cancelUrl: string;
  mode?: 'payment' | 'subscription' | 'setup';
}

export interface CheckoutSessionResponse {
  success: boolean;
  data: {
    checkoutUrl: string;
  };
  message: string;
}

/**
 * Get all available subscription packages
 * @returns Promise<any[]> - List of available subscription packages
 */
export const getAllProducts = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<any[]>('/billing/packages');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get products: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching products');
  }
};

/**
 * Get the current user's billing information and subscription details
 * @returns Promise<UserBillingInfo> - User's billing and subscription information
 */
export const getUserBillingInfo = async (): Promise<UserBillingInfo> => {
  try {
    const response = await apiClient.get<UserBillingInfo>('/billing/user');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user billing info: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching billing information');
  }
};

/**
 * Create a Stripe checkout session
 * @param checkoutData - Checkout session configuration
 * @returns Promise<CheckoutSessionResponse> - Checkout session URL and ID
 */
export const createCheckoutSession = async (checkoutData: CheckoutSessionRequest): Promise<CheckoutSessionResponse> => {
  try {
    const response = await apiClient.post<CheckoutSessionResponse>('/billing/checkout-session', checkoutData);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while creating checkout session');
  }
};

// Export all billing-related functions as a service object
export const billingService = {
  getAllProducts,
  getUserBillingInfo,
  createCheckoutSession,
};

export default billingService;
