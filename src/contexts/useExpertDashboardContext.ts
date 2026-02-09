import { useContext } from "react";
import { ExpertDashboardContext, ExpertDashboardContextType } from "./ExpertDashboardContext";

// Custom hook to use the ExpertDashboard context with error handling
export function useExpertDashboardContext(): ExpertDashboardContextType {
  const context = useContext(ExpertDashboardContext);

  if (context === undefined) {
    throw new Error(
      "useExpertDashboardContext must be used within an ExpertDashboardProvider. " +
        "Make sure to wrap your component tree with <ExpertDashboardProvider>."
    );
  }

  return context;
}
