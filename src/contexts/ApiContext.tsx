import React, { createContext, useEffect, ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import apiClient from "../services/api/client";

interface ApiContextType {
  // We can extend this later with additional API-related functionality
  isInitialized: boolean;
}

export const ApiContext = createContext<ApiContextType>({
  isInitialized: false,
});

interface ApiProviderProps {
  children: ReactNode;
}

// Decode a JWT and check whether it has passed its `exp` claim
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // treat malformed tokens as expired
  }
};

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading, logout } = useAuth0();

  useEffect(() => {
    let requestInterceptor: number | null = null;
    let responseInterceptor: number | null = null;

    const forceLogout = () => {
      logout({ logoutParams: { returnTo: window.location.origin } });
    };

    const setupInterceptors = () => {
      // Remove existing interceptors if they exist
      if (requestInterceptor !== null) {
        apiClient.interceptors.request.eject(requestInterceptor);
      }
      if (responseInterceptor !== null) {
        apiClient.interceptors.response.eject(responseInterceptor);
      }

      // Request interceptor — attach token, checking expiry for localStorage tokens
      requestInterceptor = apiClient.interceptors.request.use(
        async (config) => {
          try {
            if (isAuthenticated) {
              // Get Auth0 token (auto-refreshes via refresh token when possible)
              const token = await getAccessTokenSilently({
                authorizationParams: {
                  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                  scope: "openid profile email",
                },
              });

              if (token) {
                config.headers.Authorization = `Bearer ${token}`;
              }
            } else {
              // Fallback to localStorage token for backward compatibility
              const token = localStorage.getItem("auth_token");
              if (token) {
                if (isTokenExpired(token)) {
                  forceLogout();
                  return Promise.reject(new Error("auth_token expired"));
                }
                config.headers.Authorization = `Bearer ${token}`;
              }
            }
          } catch (error: unknown) {
            const authError = error as { error?: string };
            // Auth0 errors that signal the session/refresh-token is fully expired
            if (
              authError?.error === "login_required" ||
              authError?.error === "consent_required" ||
              authError?.error === "interaction_required"
            ) {
              forceLogout();
              return Promise.reject(error);
            }

            console.warn("Failed to get Auth0 token, falling back to localStorage:", error);

            // Fallback to localStorage token
            const token = localStorage.getItem("auth_token");
            if (token) {
              if (isTokenExpired(token)) {
                forceLogout();
                return Promise.reject(new Error("auth_token expired"));
              }
              config.headers.Authorization = `Bearer ${token}`;
            }
          }

          // Log requests in development
          if (import.meta.env.DEV) {
            console.log("API Request:", {
              method: config.method?.toUpperCase(),
              url: config.url,
              data: config.data,
              hasAuth: !!config.headers.Authorization,
            });
          }

          return config;
        },
        (error) => {
          console.error("Request Error:", error);
          return Promise.reject(error);
        }
      );

      // Response interceptor — treat any 401 from the server as a session expiry
      responseInterceptor = apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error?.response?.status === 401) {
            forceLogout();
          }
          return Promise.reject(error);
        }
      );
    };

    // Only setup interceptors when Auth0 is not loading
    if (!isLoading) {
      setupInterceptors();
    }

    // Cleanup function
    return () => {
      if (requestInterceptor !== null) {
        apiClient.interceptors.request.eject(requestInterceptor);
      }
      if (responseInterceptor !== null) {
        apiClient.interceptors.response.eject(responseInterceptor);
      }
    };
  }, [getAccessTokenSilently, isAuthenticated, isLoading, logout]);

  const contextValue: ApiContextType = {
    isInitialized: !isLoading,
  };

  return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
};
