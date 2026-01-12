import React, { createContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "../types/user";
import { UserBillingData } from "../types/billing";
import { userService } from "../services/api/users";
import { billingService } from "../services/api/billing";
import { useApiContext } from "./useApiContext";

interface AppContextType {
  // User Profile State
  userProfile: User | null;
  userLoading: boolean;
  userError: string | null;
  refreshUserProfile: () => Promise<void>;
  // User Billing State
  userBilling: UserBillingData | null;
  billingLoading: boolean;
  billingError: string | null;
  refreshUserBilling: () => Promise<void>;
  // App initialization state
  appInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user: auth0User, isLoading: auth0Loading } = useAuth0();
  const { isInitialized: apiInitialized } = useApiContext();

  // User profile state
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // User billing state
  const [userBilling, setUserBilling] = useState<UserBillingData | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);

  // App-wide state
  const [appInitialized, setAppInitialized] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated || !auth0User || !apiInitialized) {
      setUserProfile(null);
      setUserError(null);
      // Only set as initialized if not authenticated or API not ready
      if (!isAuthenticated) {
        setAppInitialized(true);
      }
      return;
    }

    // Small delay to ensure token interceptor is fully set up
    await new Promise((resolve) => setTimeout(resolve, 100));
    setUserLoading(true);
    setUserError(null);

    try {
      const profile = await userService.getCurrentUser();
      setUserProfile(profile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load user profile";
      setUserError(errorMessage);
      console.error("Failed to fetch user profile:", err);

      // Still set as initialized even on error to prevent infinite loading
      setUserProfile(null);
    } finally {
      setUserLoading(false);
      setAppInitialized(true);
    }
  }, [isAuthenticated, auth0User, apiInitialized]);

  const fetchUserBilling = useCallback(async () => {
    if (!isAuthenticated || !auth0User || !apiInitialized) {
      setUserBilling(null);
      setBillingError(null);
      return;
    }

    setBillingLoading(true);
    setBillingError(null);

    try {
      const billingResponse = await billingService.getUserBillingInfo();
      setUserBilling(billingResponse.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load billing information";
      setBillingError(errorMessage);
      console.error("Failed to fetch user billing info:", err);
      setUserBilling(null);
    } finally {
      setBillingLoading(false);
    }
  }, [isAuthenticated, auth0User, apiInitialized]);

  // Initialize app when authentication state changes
  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      // Reset initialization state when auth changes
      setAppInitialized(false);

      if (!auth0Loading) {
        if (isAuthenticated && apiInitialized) {
          await fetchUserProfile();
          // Fetch billing info alongside profile
          await fetchUserBilling();
        } else {
          // User is not authenticated or API not ready - clean up state
          if (mounted) {
            setUserProfile(null);
            setUserError(null);
            setUserLoading(false);
            setUserBilling(null);
            setBillingError(null);
            setBillingLoading(false);
            // Only set as initialized if not authenticated
            if (!isAuthenticated) {
              setAppInitialized(true);
            }
          }
        }
      }
    };

    initializeApp();

    return () => {
      mounted = false;
    };
  }, [
    isAuthenticated,
    auth0Loading,
    auth0User,
    apiInitialized,
    fetchUserProfile,
    fetchUserBilling,
  ]);

  const refreshUserProfile = async () => {
    if (isAuthenticated && auth0User && apiInitialized) {
      await fetchUserProfile();
    }
  };

  const refreshUserBilling = async () => {
    if (isAuthenticated && auth0User && apiInitialized) {
      await fetchUserBilling();
    }
  };

  const value: AppContextType = {
    // User profile
    userProfile,
    userLoading,
    userError,
    refreshUserProfile,

    // User billing
    userBilling,
    billingLoading,
    billingError,
    refreshUserBilling,

    // App initialization
    appInitialized,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
