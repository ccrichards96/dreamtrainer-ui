import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useApp } from "../../contexts/useAppContext";
import { RefreshCw, AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Optional roles that are allowed to access the route
  requireSubscription?: boolean; // Whether an active subscription is required
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireSubscription = false,
}) => {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { userProfile, userLoading, userError, userBilling, billingLoading, appInitialized } =
    useApp();
  const location = useLocation();

  // Routes that don't require onboarding completion
  const onboardingExemptRoutes = ["/onboarding", "/checkout/success"];

  // Show loading while Auth0 is loading
  if (auth0Loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#c5a8de]" />
          <span className="text-lg text-gray-600">Authenticating...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show loading while app is initializing (fetching user profile and billing)
  if (!appInitialized || userLoading || (requireSubscription && billingLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#c5a8de]" />
          <span className="text-lg text-gray-600">Loading your info...</span>
        </div>
      </div>
    );
  }

  // Show error state if user info failed to load
  if (userError && !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load info</h2>
          <p className="text-gray-600 mb-4">{userError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#c5a8de] text-white px-6 py-2 rounded-lg hover:bg-[#b399d6] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  // If roles are specified, check if user has one of the allowed roles
  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#c5a8de] text-white px-6 py-2 rounded-lg hover:bg-[#b399d6] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if current route is exempt from onboarding requirements
  const isOnboardingExempt = onboardingExemptRoutes.includes(location.pathname);

  // Check onboarding completion for protected routes that require it
  if (!isOnboardingExempt && userProfile && !userProfile.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  // If we require onboarding but don't have user profile, something went wrong
  if (!isOnboardingExempt && !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Required</h2>
          <p className="text-gray-600 mb-4">
            Unable to load your user profile. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#c5a8de] text-white px-6 py-2 rounded-lg hover:bg-[#b399d6] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Check subscription requirement if needed
  if (requireSubscription) {
    // If no billing info exists at all, allow access (new users who haven't purchased yet)
    if (!userBilling) {
      return <>{children}</>;
    }

    // If billing info exists, check subscription status
    const hasActiveSubscription = userBilling.subscriptionStatus?.hasActiveSubscription;
    const canAccessProduct = userBilling.subscriptionStatus?.canAccessProduct;

    // Redirect to subscription required page if:
    // 1. User has a subscription object (they purchased before)
    // 2. But the subscription is not active or they can't access the product
    if (userBilling.subscription && (!hasActiveSubscription || !canAccessProduct)) {
      // Don't redirect if already on the renew page
      if (location.pathname !== "/renew") {
        return <Navigate to="/renew" state={{ from: location }} replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
