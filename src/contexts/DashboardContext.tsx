import React, { createContext, ReactNode, useState, useCallback, useEffect } from "react";
import { Announcement } from "../types/announcements";
import { getAllAnnouncements } from "../services/api/announcements";

// Define the module interface
export interface Module {
  id: string;
  title: string;
  description?: string;
  completedAt?: Date;
}

// Define the shape of our Dashboard context
export interface DashboardContextType {
  startingScore: number | null;
  startingScoreDate: Date | null;
  currentScore: number | null;
  currentScoreDate: Date | null;
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  refetchDashboard: () => Promise<void>;
  getTestScores: (courseId: string) => Promise<void>;
}

// Create the context with undefined as default
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// DashboardProvider component that manages dashboard state
interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [startingScore, setStartingScore] = useState<number | null>(null);
  const [startingScoreDate, setStartingScoreDate] = useState<Date | null>(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [currentScoreDate, setCurrentScoreDate] = useState<Date | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTestScores = useCallback(async (_courseId: string): Promise<void> => {
    // This API call is deprecated as a requirement for loading the dashboard
    return;
  }, []);

  // Refetch function that can be called to update dashboard data
  const refetchDashboard = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both dashboard data and announcements in parallel
      const [announcementsData] = await Promise.all([getAllAnnouncements()]);

      // Set announcements data
      setAnnouncements(announcementsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching dashboard data";
      setError(errorMessage);
      console.error("Dashboard API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize dashboard data on first mount
  useEffect(() => {
    refetchDashboard();
  }, [refetchDashboard]);

  const value: DashboardContextType = {
    startingScore,
    startingScoreDate,
    currentScore,
    currentScoreDate,
    announcements,
    loading,
    error,
    refetchDashboard,
    getTestScores,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

// Export the context for advanced use cases (optional)
export { DashboardContext };
