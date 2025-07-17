import React, { createContext, ReactNode } from 'react';
import { useAuth0, User } from '@auth0/auth0-react';

// Define the shape of our Auth context
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | undefined;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

// Create the context with undefined as default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that wraps the Auth0Provider functionality
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    isLoading
  } = useAuth0();

  // Wrapper functions for cleaner API
  const login = () => {
    loginWithRedirect();
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading: isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for advanced use cases (optional)
export { AuthContext };
