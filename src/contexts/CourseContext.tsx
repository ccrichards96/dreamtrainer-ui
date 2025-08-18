import React, { createContext, ReactNode, useState, useCallback } from 'react';
import { Course, Module } from '../types/modules';
import { Test } from '../types/tests';
import { getCourseWithModulesById, getAllCourses as fetchAllCourses } from '../services/api/modules';



 // Fallback sample data for development
// const fallbackModules: Module[] = [
//   {
//     id: "sample-module-1",
//     courseId: courseId,
//     categoryId: null,
//     topic: "TOEFL: Writing Question 1",
//     description: "Master the TOEFL Writing Task 1 - Integrated Writing. Learn how to effectively read an academic passage, listen to a lecture, and write a coherent response that demonstrates your ability to synthesize information from multiple sources.",
//     level: 1,
//     status: "active",
//     estimatedTime: 30,
//     videoUrl: "https://vimeo.com/981374557/52c7d357b3?share=copy",
//     botIframeUrl: "https://app.vectorshift.ai/chatbots/deployed/67c28ce25d6b7f0ba2b47803",
//     lessonContent: "Comprehensive lesson content for TOEFL Writing Task 1",
//     createdBy: "system",
//     createdAt: new Date(),
//     updatedAt: new Date()
//   },
//   {
//     id: "sample-module-2",
//     courseId: courseId,
//     categoryId: null,
//     topic: "TOEFL: Writing Question 2",
//     description: "Master the TOEFL Writing Task 2 - Independent Writing. Learn how to develop your ideas, organize your thoughts, and write a well-structured essay that demonstrates your ability to express and support your opinions effectively.",
//     level: 2,
//     status: "active",
//     estimatedTime: 35,
//     videoUrl: "https://www.youtube.com/embed/8DaTKVBqUNs",
//     botIframeUrl: "https://app.vectorshift.ai/chatbots/deployed/67c28ce25d6b7f0ba2b47803",
//     lessonContent: "Comprehensive lesson content for TOEFL Writing Task 2",
//     createdBy: "system",
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }
// ];

// const fallbackCourse = {
//   id: courseId,
//   name: "TOEFL Writing Mastery Course",
//   description: "Complete TOEFL Writing preparation course",
//   createdAt: new Date(),
//   updatedAt: new Date()
// };

export interface CourseContextType {
  currentCourse: Course | null;
  currentModule: Module | null;
  modules: Module[];
  tests: Test[];
  
  // Module navigation
  currentModuleIndex: number;
  completedModules: Set<number>;
  
  // Test management
  isTestMode: boolean;
  currentTest: Test | null;
  allModulesCompleted: boolean;
  
  // State management
  loading: boolean;
  error: string | null;
  
  // Actions
  loadCourse: (courseId: string) => Promise<void>;
  getAllCourses: () => Promise<Course[]>;
  setCurrentModuleIndex: (index: number) => void;
  markModuleAsCompleted: (index: number) => void;
  nextModule: () => void;
  previousModule: () => void;
  
  // Test actions
  startTestMode: () => void;
  exitTestMode: () => void;
  
  // Utility functions
  getNextModule: () => Module | null;
  getPreviousModule: () => Module | null;
  getProgressPercentage: () => number;
  isLastModule: () => boolean;
  isFirstModule: () => boolean;
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
  const [currentModuleIndex, setCurrentModuleIndexState] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Test-related state
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [allModulesCompleted, setAllModulesCompleted] = useState<boolean>(false);


  // Load course data
  const loadCourse = useCallback(async (courseId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCourseWithModulesById(courseId);
      // API returns { success: true, data: { course: {...}, modules: [...], tests: [...] }, message: "..." }
      const data = response.data;
      
      setCurrentCourse(data);
      setModules(data.modules || []);
      setTests(data.tests || []);
      // setTestAttempts(data.testAttempts);

      // Reset module navigation state
      setCurrentModuleIndexState(0);
      setCompletedModules(new Set());
      setCurrentModule(data.modules?.[0] || null);
    } catch (err) {
      console.warn('Course loading failed, using fallback data:', err);

      setCurrentCourse(null);
      setModules([]);
      setTests([]);
      setCurrentModuleIndexState(0);
      setCompletedModules(new Set());
      setCurrentModule(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all available courses
  const getAllCourses = useCallback(async (): Promise<Course[]> => {
    try {
      const response = await fetchAllCourses();
      // API returns { success: true, data: [...], message: "..." }
      // The courses are directly in the data array
      return response.data || [];
    } catch (err) {
      console.warn('Failed to fetch courses:', err);
      setError('Failed to fetch courses');
      return [];
    }
  }, []);

  

  // Set current module by index
  const setCurrentModuleIndex = useCallback((index: number): void => {
    if (index >= 0 && index < modules.length) {
      setCurrentModuleIndexState(index);
      setCurrentModule(modules[index]);
    }
  }, [modules]);

  // Mark a module as completed
  const markModuleAsCompleted = useCallback((index: number): void => {
    setCompletedModules(prev => {
      const newCompleted = new Set([...prev, index]);
      // Check if all modules are completed
      if (newCompleted.size === modules.length) {
        setAllModulesCompleted(true);
      }
      return newCompleted;
    });
  }, [modules.length]);

  // Test-related functions
  const startTestMode = useCallback((): void => {
    if (tests.length > 0) {
      // Select a random test
      const randomTest = tests[Math.floor(Math.random() * tests.length)];
      setCurrentTest(randomTest);
      setIsTestMode(true);
    }
  }, [tests]);

  const exitTestMode = useCallback((): void => {
    setIsTestMode(false);
    setCurrentTest(null);
  }, []);

  // Navigate to next module
  const nextModule = useCallback((): void => {
    if (currentModuleIndex < modules.length - 1) {
      const newIndex = currentModuleIndex + 1;
      setCurrentModuleIndex(newIndex);
    }
  }, [currentModuleIndex, modules.length, setCurrentModuleIndex]);

  // Navigate to previous module
  const previousModule = useCallback((): void => {
    if (currentModuleIndex > 0) {
      const newIndex = currentModuleIndex - 1;
      setCurrentModuleIndex(newIndex);
    }
  }, [currentModuleIndex, setCurrentModuleIndex]);

  // Get next module
  const getNextModule = useCallback((): Module | null => {
    if (currentModuleIndex === modules.length - 1) return null;
    return modules[currentModuleIndex + 1];
  }, [currentModuleIndex, modules]);

  // Get previous module
  const getPreviousModule = useCallback((): Module | null => {
    if (currentModuleIndex <= 0) return null;
    return modules[currentModuleIndex - 1];
  }, [currentModuleIndex, modules]);

  // Get progress percentage
  const getProgressPercentage = useCallback((): number => {
    if (modules.length === 0) return 0;
    return ((completedModules.size + (currentModuleIndex > completedModules.size ? 1 : 0)) / modules.length) * 100;
  }, [completedModules.size, currentModuleIndex, modules.length]);

  // Check if current module is the last
  const isLastModule = useCallback((): boolean => {
    return currentModuleIndex === modules.length - 1;
  }, [currentModuleIndex, modules.length]);

  // Check if current module is the first
  const isFirstModule = useCallback((): boolean => {
    return currentModuleIndex === 0;
  }, [currentModuleIndex]);

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
    
    // Module navigation
    currentModuleIndex,
    completedModules,
    
    // Test management
    isTestMode,
    currentTest,
    allModulesCompleted,
    
    // State management
    loading,
    error,
    
    // Actions
    loadCourse,
    getAllCourses,
    setCurrentModuleIndex,
    markModuleAsCompleted,
    nextModule,
    previousModule,
    
    // Test actions
    startTestMode,
    exitTestMode,
        
    // Utility functions
    getNextModule,
    getPreviousModule,
    getProgressPercentage,
    isLastModule,
    isFirstModule,
    refetchCourse,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export { CourseContext };
