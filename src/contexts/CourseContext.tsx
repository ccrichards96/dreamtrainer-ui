import React, { createContext, ReactNode, useState, useCallback, useEffect, useRef } from "react";
import { Course, Module, Section } from "../types/modules";
import { Test } from "../types/tests";
import {
  getCourseWithModulesById,
  getAllCourses as fetchAllCourses,
  getSectionWithModules,
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

const saveProgress = async (
  courseId: string,
  modules: Module[],
  tests: Test[],
  currentModuleIndex: number,
  completedTests: Set<string>,
  currentTestIndex: number,
  currentSectionId: string | null,
  completedSectionIds: string[],
  allCompletedModuleIds: string[],
  totalCourseModules: number
) => {
  try {
    const currentModuleId = modules[currentModuleIndex]?.id || null;
    const completedTestIds = Array.from(completedTests);
    const currentTestId = tests[currentTestIndex]?.id || null;

    // Calculate percentage using total course modules (across all sections)
    const percentageComplete =
      totalCourseModules > 0
        ? Math.round((allCompletedModuleIds.length / totalCourseModules) * 100)
        : 0;

    const progressData = {
      percentageComplete,
      currentModuleId,
      completedModuleIds: allCompletedModuleIds,
      completedTestIds,
      currentTestId,
      currentSectionId,
      completedSectionIds,
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
  currentSectionId: string | null;
  currentModule: Module | null;

  sections: Section[];
  modules: Module[];
  tests: Test[];

  // Module navigation
  completedSections: Set<string>;

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
  loadSectionModules: (sectionId: string) => Promise<void>;
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
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [currentModuleIndex, setCurrentModuleIndexState] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progressLoaded, setProgressLoaded] = useState<boolean>(false);

  // Test-related state
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [currentTestIndex, setCurrentTestIndexState] = useState<number>(0);
  const [allModulesCompleted, setAllModulesCompleted] = useState<boolean>(false);

  // Refs for cross-section progress tracking
  // Tracks ALL completed module IDs across all sections (not just the current one)
  const allCompletedModuleIdsRef = useRef<Set<string>>(new Set());
  // Total number of modules across all sections in the course
  const totalCourseModulesRef = useRef<number>(0);
  // Stores sections data from loadCourse for section-completion checking
  const courseSectionsRef = useRef<Section[]>([]);

  // Auto-save progress when module index, completed modules, or completed tests change
  // Only save after initial progress has been loaded to prevent overwriting on mount
  useEffect(() => {
    if (currentCourse && modules.length > 0 && progressLoaded) {
      // Save progress asynchronously with section-aware tracking
      saveProgress(
        currentCourse.id,
        modules,
        tests,
        currentModuleIndex,
        completedTests,
        currentTestIndex,
        currentSectionId,
        Array.from(completedSections),
        Array.from(allCompletedModuleIdsRef.current),
        totalCourseModulesRef.current
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
    currentSectionId,
    completedSections,
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

      const sortedSections = (data.sections || []).sort(
        (a: Section, b: Section) => a.order - b.order
      );

      const allModules: Module[] = [];
      sortedSections.forEach((section: Section) => {
        const sectionModules = (section.modules || []).sort((a: Module, b: Module) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          // If order is the same, sort by createdAt
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        });
        allModules.push(...sectionModules);
      });

      const sortedModules = allModules;
      setModules(sortedModules);
      setSections(sortedSections);

      // Store total course module count and sections for cross-section tracking
      totalCourseModulesRef.current = sortedModules.length;
      courseSectionsRef.current = sortedSections;

      const sortedTests = (data.tests || []).sort((a: Test, b: Test) => a.order - b.order);
      setTests(sortedTests);

      // Load saved progress from backend
      const saved = await loadProgress(courseId);
      if (saved) {
        // Populate the cross-section completed module IDs ref
        allCompletedModuleIdsRef.current = new Set(saved.completedModuleIds || []);

        // Restore completed sections
        const savedCompletedSections = new Set<string>(saved.completedSectionIds || []);
        setCompletedSections(savedCompletedSections);

        // Restore current section
        if (saved.currentSectionId) {
          setCurrentSectionId(saved.currentSectionId);
        }

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
        allCompletedModuleIdsRef.current = new Set();
        setCurrentModuleIndexState(0);
        setCompletedModules(new Set());
        setCompletedTests(new Set());
        setCompletedSections(new Set());
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
      setSections([]);
      setTests([]);
      setCurrentModuleIndexState(0);
      setCompletedSections(new Set());
      setCompletedModules(new Set());
      setCompletedTests(new Set());
      setCurrentModule(null);
      setCurrentTestIndexState(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load modules for a specific section
  const loadSectionModules = useCallback(async (sectionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const sectionWithModules = await getSectionWithModules(sectionId);

      // Sort modules by order field
      const sortedModules = (sectionWithModules.modules || []).sort((a: Module, b: Module) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      });

      setCurrentSectionId(sectionId);
      setModules(sortedModules);

      // Restore completed modules for this section from the cross-section ref
      const restoredCompleted = getModuleIndices(
        Array.from(allCompletedModuleIdsRef.current),
        sortedModules
      );
      setCompletedModules(restoredCompleted);
      setAllModulesCompleted(restoredCompleted.size === sortedModules.length);

      // Position user at the first incomplete module in this section
      let startIndex = 0;
      if (restoredCompleted.size > 0 && restoredCompleted.size < sortedModules.length) {
        // Find first module that isn't completed
        for (let i = 0; i < sortedModules.length; i++) {
          if (!restoredCompleted.has(i)) {
            startIndex = i;
            break;
          }
        }
      }
      setCurrentModuleIndexState(startIndex);
      setCurrentModule(sortedModules[startIndex] || null);
    } catch (err) {
      console.warn("Failed to load section modules:", err);
      setError("Failed to load section modules");
      setModules([]);
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
      // Also track in the cross-section ref by module ID
      const moduleId = modules[index]?.id;
      if (moduleId) {
        allCompletedModuleIdsRef.current.add(moduleId);
      }

      setCompletedModules((prev) => {
        const newCompleted = new Set([...prev, index]);

        // A section is only completed when all its modules are in the newCompleted set
        const isSectionCompleted = newCompleted.size === modules.length;
        
        if (isSectionCompleted) {
          if (currentSectionId && !completedSections.has(currentSectionId)) {
            setCompletedSections((prevSections) => new Set([...prevSections, currentSectionId]));
            
            if (allCompletedModuleIdsRef.current.size === totalCourseModulesRef.current) {
              setAllModulesCompleted(true);
            }
          }
        }
        return newCompleted;
      });
    },
    [modules, currentSectionId]
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
    // Only count modules that are actually in the completedModules set
    return (completedModules.size / modules.length) * 100;
  }, [completedModules.size, modules.length]);

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
    currentSectionId,
    modules,
    sections,
    tests,

    completedSections,

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
    loadSectionModules,
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
