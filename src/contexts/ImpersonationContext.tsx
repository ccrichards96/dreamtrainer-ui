import React, { createContext, useState, ReactNode } from "react";
import { adminService } from "../services/api/admin";
import {
  getActiveImpersonation,
  startImpersonation,
  clearImpersonation,
  ImpersonationSession,
} from "../services/impersonation";

export interface ImpersonationContextType {
  impersonation: ImpersonationSession | null;
  loginAsUser: (userId: string) => Promise<void>;
  returnToAdmin: () => void;
}

export const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

interface ImpersonationProviderProps {
  children: ReactNode;
}

export const ImpersonationProvider: React.FC<ImpersonationProviderProps> = ({ children }) => {
  const [impersonation, setImpersonation] = useState<ImpersonationSession | null>(() =>
    getActiveImpersonation()
  );

  const loginAsUser = async (userId: string) => {
    const response = await adminService.impersonateUser(userId);
    startImpersonation(response);
    setImpersonation(getActiveImpersonation());
    // Hard reload so every user-scoped hook/context across the app re-fetches
    // under the impersonated identity instead of serving stale admin-owned data.
    window.location.href = "/";
  };

  const returnToAdmin = () => {
    clearImpersonation();
    setImpersonation(null);
    window.location.href = "/admin";
  };

  const value: ImpersonationContextType = {
    impersonation,
    loginAsUser,
    returnToAdmin,
  };

  return <ImpersonationContext.Provider value={value}>{children}</ImpersonationContext.Provider>;
};
