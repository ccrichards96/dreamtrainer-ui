import React, { createContext, ReactNode, useMemo } from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import { useImpersonationContext } from "./useImpersonationContext";
import { clearImpersonation } from "../services/impersonation";

export interface AuthContextType {
  isAuthenticated: boolean;
  /**
   * The identity the app should render. While an admin is impersonating, this is
   * the impersonated user (shaped like an Auth0 profile), not the admin's own
   * Auth0 account.
   */
  user: User | undefined;
  /** The real Auth0 account behind the session — the admin's own identity while impersonating. */
  adminUser: User | undefined;
  isImpersonating: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, user, loginWithRedirect, logout: auth0Logout, isLoading } = useAuth0();
  const { impersonation } = useImpersonationContext();

  // Project the impersonated user onto the Auth0 profile shape so every consumer
  // of `user` (nav dropdown, account page, forms) reads the impersonated identity
  // without needing to know impersonation exists.
  const effectiveUser = useMemo<User | undefined>(() => {
    if (!impersonation) return user;

    const { firstName, lastName, email, avatarUrl, auth0Id, isEmailVerified } = impersonation.user;
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

    return {
      sub: auth0Id ?? undefined,
      name: fullName || email,
      given_name: firstName || undefined,
      family_name: lastName || undefined,
      email,
      email_verified: isEmailVerified,
      picture: avatarUrl ?? undefined,
    };
  }, [impersonation, user]);

  const login = () => {
    loginWithRedirect();
  };

  const logout = () => {
    // Drop any impersonation session first — otherwise it survives in sessionStorage
    // and the next login would silently resume it.
    clearImpersonation();
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const value: AuthContextType = {
    isAuthenticated,
    user: effectiveUser,
    adminUser: user,
    isImpersonating: impersonation !== null,
    login,
    logout,
    loading: isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
