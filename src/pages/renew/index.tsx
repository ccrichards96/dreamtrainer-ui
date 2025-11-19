import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CreditCard,
  RefreshCw,
  Mail,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useApp } from "../../contexts/useAppContext";
import { billingService } from "../../services/api/billing";

export default function SubscriptionRequired() {
  const { userBilling, refreshUserBilling } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Array<{ priceId?: string; id: string; name?: string }>>([]);

  const subscriptionStatus = userBilling?.subscriptionStatus.status || "unknown";
  const isPaused = subscriptionStatus === "paused";
  const isCancelled = subscriptionStatus === "canceled" || subscriptionStatus === "cancelled" || subscriptionStatus === "inactive";

  // Fetch available products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await billingService.getAllProducts();
        setProducts(allProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleRenewSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the first available product's price ID
      // You may want to add logic to select the right product/plan
      if (products.length === 0) {
        throw new Error("No products available");
      }

      // Assuming the product has a priceId field
      const priceId = products[0].priceId || products[0].id;

      const checkoutData = {
        priceIds: [priceId],
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/renew`,
        mode: "subscription" as const,
      };

      const response = await billingService.createCheckoutSession(checkoutData);
      
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to start renewal process. Please try again.";
      setError(errorMessage);
      console.error("Error creating checkout session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const returnUrl = `${window.location.origin}/dashboard`;
      const response = await billingService.generateBillingPortalLink(returnUrl);
      
      if (response.portalUrl) {
        window.location.href = response.portalUrl;
      } else {
        throw new Error("Failed to generate billing portal link");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to open billing portal. Please try again.";
      setError(errorMessage);
      console.error("Error opening billing portal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await refreshUserBilling();
      
      // Check if subscription is now active
      setTimeout(() => {
        setIsLoading(false);
        // The context will automatically redirect if subscription is active
      }, 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to refresh subscription status. Please try again.";
      setError(errorMessage);
      console.error("Error refreshing billing:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <AlertCircle className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">
              {isPaused ? "Subscription Paused" : "Subscription Inactive"}
            </h1>
            <p className="text-lg text-center text-white/90">
              {isPaused
                ? "Your subscription is currently paused"
                : "Your subscription has been cancelled or is inactive"}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Status Information */}
            <div className="mb-8">
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Access Restricted
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your subscription status: <span className="font-semibold capitalize">{subscriptionStatus}</span>
                  </p>
                  <p className="text-gray-600">
                    To continue accessing your courses, assessments, and all premium features,
                    please reactivate your subscription.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Subscription Info */}
            {userBilling?.subscription && (
              <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Your Previous Subscription
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Plan:</span> {userBilling.subscription.name}
                  </p>
                  {userBilling.subscription.amount && (
                    <p>
                      <span className="font-medium">Price:</span> ${userBilling.subscription.amount.toFixed(2)}/month
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {isCancelled ? (
                <button
                  onClick={handleRenewSubscription}
                  disabled={isLoading}
                  className="w-full bg-[#c5a8de] hover:bg-[#b399d6] disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Renew Subscription
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="w-full bg-[#c5a8de] hover:bg-[#b399d6] disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Manage Subscription in Stripe
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleRefreshStatus}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-lg border-2 border-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Subscription Status
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-600" />
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                If you're having trouble reactivating your subscription or have questions,
                our support team is here to help.
              </p>
              <a
                href="mailto:support@dreamtrainer.com"
                className="inline-flex items-center gap-2 text-[#c5a8de] hover:text-[#b399d6] font-medium transition-colors"
              >
                Contact Support
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Reactivation Benefits */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                What You'll Get Back:
              </h3>
              <ul className="space-y-3">
                {[
                  "Full access to all courses and modules",
                  "Unlimited practice tests and assessments",
                  "Personalized feedback on your submissions",
                  "Progress tracking and analytics",
                  "Priority support from our team",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
