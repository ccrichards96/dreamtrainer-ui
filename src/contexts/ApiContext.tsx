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

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    let requestInterceptor: number | null = null;

    const setupInterceptor = () => {
      // Remove existing interceptor if it exists
      if (requestInterceptor !== null) {
        apiClient.interceptors.request.eject(requestInterceptor);
      }

      // Add new interceptor
      requestInterceptor = apiClient.interceptors.request.use(
        async (config) => {
          try {
            if (isAuthenticated) {
              // Get Auth0 token
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
                config.headers.Authorization = `Bearer ${token}`;
              }
            }
          } catch (error) {
            console.warn(
              "Failed to get Auth0 token, falling back to localStorage:",
              error,
            );

            // Fallback to localStorage token
            const token = localStorage.getItem("auth_token");
            if (token) {
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
        },
      );
    };

    // Only setup interceptor when Auth0 is not loading
    if (!isLoading) {
      setupInterceptor();
    }

    // Cleanup function
    return () => {
      if (requestInterceptor !== null) {
        apiClient.interceptors.request.eject(requestInterceptor);
      }
    };
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  const contextValue: ApiContextType = {
    isInitialized: !isLoading,
  };

  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
};
