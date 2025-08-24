import React, { createContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { Announcement } from '../types/announcements';
import { getAllAnnouncements } from '../services/api/announcements';
import { getTestAttemptsByCourse } from '../services/api/tests';

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

  const getTestScores = useCallback(async (courseId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {

      const testAttempts: any = await getTestAttemptsByCourse(courseId);

      // Set dashboard data
      setStartingScore(testAttempts.firstAttempt?.score || 0);
      setStartingScoreDate(testAttempts.firstAttempt?.createdAt || null);
      setCurrentScore(testAttempts.currentAttempt?.score || 0);
      setCurrentScoreDate(testAttempts.currentAttempt?.createdAt || null);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while fetching dashboard data';
      setError(errorMessage);
      console.error('Dashboard API Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch function that can be called to update dashboard data
  const refetchDashboard = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both dashboard data and announcements in parallel
      const [announcementsData] = await Promise.all([
        getAllAnnouncements()
      ]);

      // Set dashboard data
      // setStartingScore(dashboardData.startingScore);
      // setStartingScoreDate(dashboardData.startingScoreDate);
      // setCurrentScore(dashboardData.currentScore);
      // setCurrentScoreDate(dashboardData.currentScoreDate);

      // Set announcements data
      setAnnouncements(announcementsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while fetching dashboard data';
      setError(errorMessage);
      console.error('Dashboard API Error:', err);
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

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Export the context for advanced use cases (optional)
export { DashboardContext };
