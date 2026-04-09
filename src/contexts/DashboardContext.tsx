import React, { createContext, ReactNode, useState, useCallback, useEffect } from "react";
import { Announcement } from "../types/announcements";
import { listCourseAnnouncements } from "../services/api/announcements";

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
  fetchAnnouncementsForCourse: (courseId: string) => Promise<void>;
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

  const fetchAnnouncementsForCourse = useCallback(async (courseId: string): Promise<void> => {
    try {
      const { data } = await listCourseAnnouncements(courseId);
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to fetch course announcements:", err);
    }
  }, []);

  // Refetch function that can be called to update dashboard data
  const refetchDashboard = useCallback(async (): Promise<void> => {
    // Announcements are fetched per-course via fetchAnnouncementsForCourse
  }, []);

  const value: DashboardContextType = {
    startingScore,
    startingScoreDate,
    currentScore,
    currentScoreDate,
    announcements,
    loading,
    error,
    refetchDashboard,
    fetchAnnouncementsForCourse,
    getTestScores,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

// Export the context for advanced use cases (optional)
export { DashboardContext };
