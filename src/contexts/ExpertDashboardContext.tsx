import React, { createContext, ReactNode, useState, useCallback } from "react";
import { Announcement } from "../types/announcements";
import { ExpertProfile } from "../types/modules";
import { useApp } from "./useAppContext";

// Form data interfaces for each manage tab
export interface CoursePlanFormData {
  learningObjectives: string[];
  prerequisites: string[];
  targetAudience: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GoalsOutcomesFormData {
  // Future: goals and outcomes fields
}

export interface PricingFormData {
  price: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CurriculumFormData {
  // Future: curriculum fields
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ResourcesFormData {
  // Future: resources fields
}

// Combined course data
export interface CourseManageData {
  coursePlan: CoursePlanFormData;
  goalsOutcomes: GoalsOutcomesFormData;
  pricing: PricingFormData;
  curriculum: CurriculumFormData;
  resources: ResourcesFormData;
  announcements: Announcement[];
}

// Initial form data defaults
const initialCoursePlanData: CoursePlanFormData = {
  learningObjectives: ["", "", ""],
  prerequisites: [""],
  targetAudience: [""],
};

const initialCourseManageData: CourseManageData = {
  coursePlan: initialCoursePlanData,
  goalsOutcomes: {},
  pricing: { price: "" },
  curriculum: {},
  resources: {},
  announcements: [],
};

// Context type definition
export interface ExpertDashboardContextType {
  // Expert profile from user data
  expertProfile: ExpertProfile | null;

  // Course management data
  courseManageData: CourseManageData;

  // Update functions
  updateCoursePlan: (data: Partial<CoursePlanFormData>) => void;
  updateGoalsOutcomes: (data: Partial<GoalsOutcomesFormData>) => void;
  updatePricing: (data: Partial<PricingFormData>) => void;
  updateCurriculum: (data: Partial<CurriculumFormData>) => void;
  updateResources: (data: Partial<ResourcesFormData>) => void;
  updateAnnouncements: (announcements: Announcement[]) => void;
  // Reset functions
  resetCourseManageData: () => void;

  // Loading state
  isSaving: boolean;
}

// Create the context
export const ExpertDashboardContext = createContext<ExpertDashboardContextType | undefined>(
  undefined
);

// Provider props
interface ExpertDashboardProviderProps {
  children: ReactNode;
}

// Provider component
export const ExpertDashboardProvider: React.FC<ExpertDashboardProviderProps> = ({ children }) => {
  const { userProfile } = useApp();
  const expertProfile = userProfile?.expertProfile ?? null;

  const [courseManageData, setCourseManageData] = useState<CourseManageData>(initialCourseManageData);
  const [isSaving] = useState(false);

  const updateCoursePlan = useCallback((data: Partial<CoursePlanFormData>) => {
    setCourseManageData((prev) => ({
      ...prev,
      coursePlan: { ...prev.coursePlan, ...data },
    }));
  }, []);

  const updateGoalsOutcomes = useCallback((data: Partial<GoalsOutcomesFormData>) => {
    setCourseManageData((prev) => ({
      ...prev,
      goalsOutcomes: { ...prev.goalsOutcomes, ...data },
    }));
  }, []);

  const updatePricing = useCallback((data: Partial<PricingFormData>) => {
    setCourseManageData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, ...data },
    }));
  }, []);

  const updateCurriculum = useCallback((data: Partial<CurriculumFormData>) => {
    setCourseManageData((prev) => ({
      ...prev,
      curriculum: { ...prev.curriculum, ...data },
    }));
  }, []);

  const updateResources = useCallback((data: Partial<ResourcesFormData>) => {
    setCourseManageData((prev) => ({
      ...prev,
      resources: { ...prev.resources, ...data },
    }));
  }, []);

  const updateAnnouncements = useCallback((announcements: Announcement[]) => {
    setCourseManageData((prev) => ({
      ...prev,
      announcements,
    }));
  }, []);   

  const resetCourseManageData = useCallback(() => {
    setCourseManageData(initialCourseManageData);
  }, []);

  const value: ExpertDashboardContextType = {
    expertProfile,
    courseManageData,
    updateCoursePlan,
    updateGoalsOutcomes,
    updatePricing,
    updateCurriculum,
    updateResources,
    resetCourseManageData,
    updateAnnouncements,
    isSaving,
  };

  return (
    <ExpertDashboardContext.Provider value={value}>
      {children}
    </ExpertDashboardContext.Provider>
  );
};