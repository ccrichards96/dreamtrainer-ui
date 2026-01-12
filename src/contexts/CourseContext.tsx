import React, { createContext, ReactNode, useState, useCallback, useEffect } from "react";
import { Course, Module } from "../types/modules";
import { Test } from "../types/tests";
import {
  getCourseWithModulesById,
  getAllCourses as fetchAllCourses,
} from "../services/api/modules";
import { updateProgress, getUserCourseProgress } from "../services/api/course-progress";
import type { CourseProgress } from "../types/course-progress";

// Helper to convert module IDs to indices
const getModuleIndices = (moduleIds: string[], modules: Module[]): Set<number> => {
  const indices = new Set<number>();
  moduleIds.forEach((id) => {
    const index = modules.findIndex((m) => m.id === id);
    if (index !== -1) indices.add(index);
  });
  return indices;
};

// Helper to convert module indices to IDs
const getModuleIds = (indices: Set<number>, modules: Module[]): string[] => {
  return Array.from(indices)
    .map((idx) => modules[idx]?.id)
    .filter((id): id is string => id !== undefined);
};

const saveProgress = async (
  courseId: string,
  modules: Module[],
  tests: Test[],
  currentModuleIndex: number,
  completedModules: Set<number>,
  completedTests: Set<string>,
  currentTestIndex: number
) => {
  try {
    const currentModuleId = modules[currentModuleIndex]?.id || null;
    const completedModuleIds = getModuleIds(completedModules, modules);
    const completedTestIds = Array.from(completedTests);
    const currentTestId = tests[currentTestIndex]?.id || null;

    // Calculate percentage: completed modules / total modules
    const percentageComplete =
      modules.length > 0 ? Math.round((completedModules.size / modules.length) * 100) : 0;

    const progressData = {
      percentageComplete,
      currentModuleId,
      completedModuleIds,
      completedTestIds,
      currentTestId,
    };

    await updateProgress(courseId, progressData);
  } catch (e) {
    console.warn("Failed to save progress:", e);
  }
};

const loadProgress = async (courseId: string): Promise<CourseProgress | null> => {
  try {
    const backendProgress = await getUserCourseProgress(courseId);
    return backendProgress;
  } catch (e) {
    console.warn("Failed to load progress from backend:", e);
    return null;
  }
};

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
  currentTestIndex: number;
  completedTests: Set<string>; // Track completed tests by ID
  allModulesCompleted: boolean;

  // State management
  loading: boolean;
  error: string | null;

  // Actions
  loadCourse: (courseId: string) => Promise<void>;
  getAllCourses: () => Promise<Course[]>;
  setCurrentModuleIndex: (index: number) => void;
  markModuleAsCompleted: (index: number) => void;
  markTestAsCompleted: (testId: string) => void; // New function to mark tests as completed
  nextModule: () => void;
  previousModule: () => void;

  // Test actions
  startTestMode: () => void;
  exitTestMode: () => void;
  setCurrentTestIndex: (index: number) => void;
  resetToFirstModule: (clearProgress?: boolean) => void;
  resetCourseProgress: () => void;
  getNextTestInSequence: () => Test | null;
  getTestProgress: () => { current: number; total: number };

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
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progressLoaded, setProgressLoaded] = useState<boolean>(false);

  // Test-related state
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [currentTestIndex, setCurrentTestIndexState] = useState<number>(0);
  const [allModulesCompleted, setAllModulesCompleted] = useState<boolean>(false);

  // Auto-save progress when module index, completed modules, or completed tests change
  // Only save after initial progress has been loaded to prevent overwriting on mount
  useEffect(() => {
    if (currentCourse && modules.length > 0 && progressLoaded) {
      // Save progress asynchronously with ID-based tracking
      saveProgress(
        currentCourse.id,
        modules,
        tests,
        currentModuleIndex,
        completedModules,
        completedTests,
        currentTestIndex
      ).catch((err) => {
        console.error("Failed to auto-save progress:", err);
      });
    }
  }, [
    currentModuleIndex,
    completedModules,
    completedTests,
    currentTestIndex,
    currentCourse,
    modules,
    tests,
    progressLoaded,
  ]);

  // Load course data
  const loadCourse = useCallback(async (courseId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCourseWithModulesById(courseId);
      const data = response.data;

      setCurrentCourse(data);

      // Sort modules by order field, then by createdAt if order is the same
      const sortedModules = (data.modules || []).sort((a: Module, b: Module) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        // If order is the same, sort by createdAt
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      });
      setModules(sortedModules);

      const sortedTests = (data.tests || []).sort((a: Test, b: Test) => a.order - b.order);
      setTests(sortedTests);
      // setTestAttempts(data.testAttempts);

      //Load saved progress from backend
      const saved = await loadProgress(courseId);
      if (saved) {
        // Convert module IDs to indices (using sorted modules)
        const savedCompletedIndices = getModuleIndices(
          saved.completedModuleIds || [],
          sortedModules
        );
        const savedCompletedTests = new Set<string>(saved.completedTestIds || []);

        // Find current module index from ID (in sorted modules)
        const currentModuleIdx = saved.currentModuleId
          ? (sortedModules.findIndex((m: Module) => m.id === saved.currentModuleId) ?? 0)
          : 0;

        // Find current test index from ID
        const currentTestIdx = saved.currentTestId
          ? sortedTests.findIndex((test: Test) => test.id === saved.currentTestId)
          : sortedTests.findIndex((test: Test) => !savedCompletedTests.has(test.id));

        setCurrentModuleIndexState(currentModuleIdx);
        setCompletedModules(savedCompletedIndices);
        setCompletedTests(savedCompletedTests);
        setCurrentModule(sortedModules[currentModuleIdx] || null);
        setCurrentTestIndexState(currentTestIdx >= 0 ? currentTestIdx : 0);
        setAllModulesCompleted(savedCompletedIndices.size === sortedModules.length);
      } else {
        // Reset to defaults
        setCurrentModuleIndexState(0);
        setCompletedModules(new Set());
        setCompletedTests(new Set());
        setCurrentModule(sortedModules[0] || null);
        setCurrentTestIndexState(0);
        setAllModulesCompleted(false);
      }

      // Mark progress as loaded to enable auto-save
      setProgressLoaded(true);
    } catch (err) {
      console.warn("Course loading failed, using fallback data:", err);

      setCurrentCourse(null);
      setModules([]);
      setTests([]);
      setCurrentModuleIndexState(0);
      setCompletedModules(new Set());
      setCompletedTests(new Set());
      setCurrentModule(null);
      setCurrentTestIndexState(0);
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
      console.warn("Failed to fetch courses:", err);
      setError("Failed to fetch courses");
      return [];
    }
  }, []);

  // Set current module by index
  const setCurrentModuleIndex = useCallback(
    (index: number): void => {
      if (index >= 0 && index < modules.length) {
        setCurrentModuleIndexState(index);
        setCurrentModule(modules[index]);
        // Auto-save is handled by useEffect
      }
    },
    [modules]
  );

  // Mark a module as completed
  const markModuleAsCompleted = useCallback(
    (index: number): void => {
      setCompletedModules((prev) => {
        const newCompleted = new Set([...prev, index]);

        // Don't auto-save here - let nextModule handle it
        // This prevents race conditions

        if (newCompleted.size === modules.length) {
          setAllModulesCompleted(true);
        }
        return newCompleted;
      });
    },
    [modules.length]
  );

  // Mark a test as completed
  const markTestAsCompleted = useCallback((testId: string): void => {
    setCompletedTests((prev) => {
      const newCompleted = new Set([...prev, testId]);
      return newCompleted;
    });
  }, []);

  // Test-related functions
  const startTestMode = useCallback((): void => {
    if (tests.length > 0) {
      // Find the next incomplete test starting from currentTestIndex
      let testToStart = tests[currentTestIndex];
      let searchIndex = currentTestIndex;

      // If current test is completed, find next incomplete test
      while (testToStart && completedTests.has(testToStart.id) && searchIndex < tests.length) {
        searchIndex++;
        testToStart = tests[searchIndex];
      }

      // If we've reached the end, wrap around to find any incomplete tests
      if (!testToStart || completedTests.has(testToStart.id)) {
        testToStart = tests.find((test: Test) => !completedTests.has(test.id)) || tests[0];
        searchIndex = tests.findIndex((test: Test) => test.id === testToStart.id);
      }

      setCurrentTest(testToStart);
      setIsTestMode(true);
      setCurrentTestIndexState(searchIndex);
    }
  }, [tests, currentTestIndex, completedTests]);

  const exitTestMode = useCallback((): void => {
    setIsTestMode(false);
    setCurrentTest(null);
  }, []);

  const setCurrentTestIndex = useCallback(
    (index: number): void => {
      if (index >= 0 && index < tests.length) {
        setCurrentTestIndexState(index);
        setCurrentTest(tests[index]);
      }
    },
    [tests]
  );

  const resetToFirstModule = useCallback(
    (clearProgress: boolean = false): void => {
      setCurrentModuleIndexState(0);
      setCurrentModule(modules[0] || null);
      setIsTestMode(false);
      setCurrentTest(null);
      setCurrentTestIndexState(0); // Reset test index to start from the beginning
      setAllModulesCompleted(false);

      // Optionally reset completed modules and tests if you want users to go through everything fresh
      if (clearProgress) {
        setCompletedModules(new Set());
        setCompletedTests(new Set());
      }
    },
    [modules]
  );

  // Reset course progress while maintaining test progression
  const resetCourseProgress = useCallback((): void => {
    // Reset module progress only - keep test progression
    setCurrentModuleIndexState(0);
    setCurrentModule(modules[0] || null);
    setCompletedModules(new Set());
    setAllModulesCompleted(false);

    // Exit test mode temporarily (will re-enter after reset)
    setIsTestMode(false);
    setCurrentTest(null);
  }, [modules]);

  // Get the next test in the sequence (useful for preview/information)
  const getNextTestInSequence = useCallback((): Test | null => {
    if (tests.length === 0) return null;
    return tests[currentTestIndex] || null;
  }, [tests, currentTestIndex]);

  // Get test progress information
  const getTestProgress = useCallback((): {
    current: number;
    total: number;
  } => {
    return {
      current: currentTestIndex + 1, // +1 for 1-based indexing for display
      total: tests.length,
    };
  }, [currentTestIndex, tests.length]);

  // Navigate to next module
  const nextModule = useCallback((): void => {
    if (currentModuleIndex < modules.length - 1) {
      const newIndex = currentModuleIndex + 1;
      setCurrentModuleIndexState(newIndex);
      setCurrentModule(modules[newIndex]);
      // Auto-save is handled by useEffect
    }
  }, [currentModuleIndex, modules]);

  // Navigate to previous module
  const previousModule = useCallback((): void => {
    if (currentModuleIndex > 0) {
      const newIndex = currentModuleIndex - 1;
      setCurrentModuleIndexState(newIndex);
      setCurrentModule(modules[newIndex]);
      // Auto-save is handled by useEffect
    }
  }, [currentModuleIndex, modules]);

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
    return (
      ((completedModules.size + (currentModuleIndex > completedModules.size ? 1 : 0)) /
        modules.length) *
      100
    );
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
    currentTestIndex,
    completedTests,
    allModulesCompleted,

    // State management
    loading,
    error,

    // Actions
    loadCourse,
    getAllCourses,
    setCurrentModuleIndex,
    markModuleAsCompleted,
    markTestAsCompleted,
    nextModule,
    previousModule,

    // Test actions
    startTestMode,
    exitTestMode,
    setCurrentTestIndex,
    resetToFirstModule,
    resetCourseProgress,
    getNextTestInSequence,
    getTestProgress,

    // Utility functions
    getNextModule,
    getPreviousModule,
    getProgressPercentage,
    isLastModule,
    isFirstModule,
    refetchCourse,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export { CourseContext };
