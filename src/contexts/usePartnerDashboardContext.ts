import { useContext } from "react";
import { PartnerDashboardContext, PartnerDashboardContextType } from "./PartnerDashboardContext";

// Custom hook to use the PartnerDashboard context with error handling
export function usePartnerDashboardContext(): PartnerDashboardContextType {
  const context = useContext(PartnerDashboardContext);

  if (context === undefined) {
    throw new Error(
      "usePartnerDashboardContext must be used within a PartnerDashboardProvider. " +
        "Make sure to wrap your component tree with <PartnerDashboardProvider>."
    );
  }

  return context;
}
