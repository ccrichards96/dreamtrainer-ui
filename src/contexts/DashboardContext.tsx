import React, { createContext, ReactNode, useState, useCallback, useEffect } from 'react';

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
  modulesCompleted: Module[];
  modulesToComplete: Module[];
  showFinalAssessment: boolean;
  loading: boolean;
  error: string | null;
  refetchDashboard: () => Promise<void>;
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
  const [modulesCompleted, setModulesCompleted] = useState<Module[]>([]);
  const [modulesToComplete, setModulesToComplete] = useState<Module[]>([]);
  const [showFinalAssessment, setShowFinalAssessment] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call to fetch dashboard data
  const fetchDashboardFromAPI = async (): Promise<{
    startingScore: number;
    startingScoreDate: Date;
    currentScore: number;
    currentScoreDate: Date | null;
    modulesCompleted: Module[];
    modulesToComplete: Module[];
    showFinalAssessment: boolean;
  }> => {
    // Simulate network delay (1-3 seconds)
    const delay = Math.random() * 2000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Generate realistic data for a first-time user
    const currentDate = null;
    const startingDate = new Date();

    return {
      startingScore: 0,
      startingScoreDate: startingDate,
      currentScore: 0,
      currentScoreDate: currentDate,
      modulesCompleted: [],
      modulesToComplete: [
        {
          id: 'mod1',
          title: 'Initial Assessment',
          description: 'Take your baseline assessment to determine your starting level'
        },
        {
          id: 'mod2',
          title: 'Reading Fundamentals',
          description: 'Learn core reading comprehension strategies'
        },
        {
          id: 'mod3',
          title: 'Listening Skills',
          description: 'Develop active listening and note-taking techniques'
        },
        {
          id: 'mod4',
          title: 'Speaking Practice',
          description: 'Build confidence in verbal communication'
        },
        {
          id: 'mod5',
          title: 'Writing Essentials',
          description: 'Master structured writing and grammar'
        },
        {
          id: 'mod6',
          title: 'Practice Test 1',
          description: 'Full-length practice examination'
        },
        {
          id: 'mod7',
          title: 'Test Strategies',
          description: 'Learn time management and test-taking strategies'
        },
        {
          id: 'mod8',
          title: 'Final Practice Test',
          description: 'Complete practice test before certification'
        }
      ],
      showFinalAssessment: false
    };
  };

  // Refetch function that can be called to update dashboard data
  const refetchDashboard = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardFromAPI();
      setStartingScore(data.startingScore);
      setStartingScoreDate(data.startingScoreDate);
      setCurrentScore(data.currentScore);
      setCurrentScoreDate(data.currentScoreDate);
      setModulesCompleted(data.modulesCompleted);
      setModulesToComplete(data.modulesToComplete);
      setShowFinalAssessment(data.showFinalAssessment);
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
    modulesCompleted,
    modulesToComplete,
    showFinalAssessment,
    loading,
    error,
    refetchDashboard,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Export the context for advanced use cases (optional)
export { DashboardContext };
