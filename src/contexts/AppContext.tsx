import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "../types/user";
import { userService } from "../services/api/users";
import { useApiContext } from "./useApiContext";

interface AppContextType {
  // User Profile State
  userProfile: User | null;
  userLoading: boolean;
  userError: string | null;
  refreshUserProfile: () => Promise<void>;
  // App initialization state
  appInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    isAuthenticated,
    user: auth0User,
    isLoading: auth0Loading,
  } = useAuth0();
  const { isInitialized: apiInitialized } = useApiContext();

  // User profile state
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // App-wide state
  const [appInitialized, setAppInitialized] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated || !auth0User || !apiInitialized) {
      console.log("Skipping user profile fetch:", {
        isAuthenticated,
        hasAuth0User: !!auth0User,
        apiInitialized,
      });
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
      console.log("Fetching user profile for:", auth0User.sub);
      const profile = await userService.getCurrentUser();
      setUserProfile(profile);
      console.log("User profile loaded:", profile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load user profile";
      setUserError(errorMessage);
      console.error("Failed to fetch user profile:", err);

      // Still set as initialized even on error to prevent infinite loading
      setUserProfile(null);
    } finally {
      setUserLoading(false);
      setAppInitialized(true);
    }
  }, [isAuthenticated, auth0User, apiInitialized]);

  // Initialize app when authentication state changes
  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      // Reset initialization state when auth changes
      setAppInitialized(false);

      console.log("Initializing app:", {
        auth0Loading,
        isAuthenticated,
        apiInitialized,
        hasAuth0User: !!auth0User,
      });

      if (!auth0Loading) {
        if (isAuthenticated && apiInitialized) {
          console.log("Conditions met, fetching user profile...");
          await fetchUserProfile();
        } else {
          // User is not authenticated or API not ready - clean up state
          console.log(
            "Cleaning up state - user not authenticated or API not ready",
          );
          if (mounted) {
            setUserProfile(null);
            setUserError(null);
            setUserLoading(false);
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
  ]);

  const refreshUserProfile = async () => {
    if (isAuthenticated && auth0User && apiInitialized) {
      await fetchUserProfile();
    }
  };

  const value: AppContextType = {
    // User profile
    userProfile,
    userLoading,
    userError,
    refreshUserProfile,

    // App initialization
    appInitialized,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
