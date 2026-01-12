import { useContext } from "react";
import { DashboardContext, DashboardContextType } from "./DashboardContext";

// Custom hook to use the Dashboard context with error handling
export function useDashboardContext(): DashboardContextType {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider. " +
        "Make sure to wrap your component tree with <DashboardProvider>."
    );
  }

  return context;
}
