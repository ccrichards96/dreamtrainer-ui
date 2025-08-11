import React, { createContext, ReactNode, useState, useCallback } from 'react';
import { Course, Module } from '../types/modules';
import { Test } from '../types/tests';
import { getCourseById } from '../services/api/modules';

export interface CourseContextType {
  currentCourse: Course | null;
  currentModule: Module | null;
  modules: Module[];
  tests: Test[];
  
  // Test management
//   testAttempts: TestAttempt[];
//   lastTestResult: TestResult | null;
  
  // State management
  loading: boolean;
  error: string | null;
  
  // Actionss
  loadCourse: (courseId: string) => Promise<void>;
  
  // Utility functions
  getNextModule: () => Module | null;
  getPreviousModule: () => Module | null;
  refetchCourse: () => Promise<void>;
}

// Create the context with undefined as default
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// CourseProvider component that manages course state
interface CourseProviderProps {
  children: ReactNode;
  userId?: string; // Optional user ID for progress tracking
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  // State variables
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
//   const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
//   const [lastTestResult, setLastTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  // Load course data
  const loadCourse = useCallback(async (courseId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourseById(courseId);
      setCurrentCourse(data.course);
      setModules(data.modules);
      setTests(data.tests);
      // setTestAttempts(data.testAttempts);

      setCurrentModule(data.modules[0] || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load course data';
      setError(errorMessage);
      console.error('Course loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get next module
  const getNextModule = useCallback((): Module | null => {
    if (!currentModule) return null;
    
    const currentIndex = modules.findIndex(m => m.id === currentModule.id);
    if (currentIndex === -1 || currentIndex === modules.length - 1) return null;
    
    return modules[currentIndex + 1];
  }, [currentModule, modules]);

  // Get previous module
  const getPreviousModule = useCallback((): Module | null => {
    if (!currentModule) return null;
    
    const currentIndex = modules.findIndex(m => m.id === currentModule.id);
    if (currentIndex <= 0) return null;
    
    return modules[currentIndex - 1];
  }, [currentModule, modules]);

  const refetchCourse = useCallback(async (): Promise<void> => {
    if (currentCourse) {
      await loadCourse(currentCourse.id);
    }
  }, [currentCourse, loadCourse]);

  const value: CourseContextType = {
    // Current course and modules
    currentCourse,
    currentModule,
    modules,
    tests,
    
    // State management
    loading,
    error,
    
    // Actions
    loadCourse,
        
    // Utility functions
    getNextModule,
    getPreviousModule,
    refetchCourse,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export { CourseContext };
