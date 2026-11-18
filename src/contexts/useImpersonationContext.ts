import { useContext } from "react";
import { ImpersonationContext, ImpersonationContextType } from "./ImpersonationContext";

// Custom hook to use the Impersonation context with error handling
export function useImpersonationContext(): ImpersonationContextType {
  const context = useContext(ImpersonationContext);

  if (context === undefined) {
    throw new Error(
      "useImpersonationContext must be used within an ImpersonationProvider. " +
        "Make sure to wrap your component tree with <ImpersonationProvider>."
    );
  }

  return context;
}
