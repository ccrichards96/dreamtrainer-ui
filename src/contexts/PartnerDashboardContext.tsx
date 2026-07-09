import React, { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { getMyPartnerProfile } from "../services/api/partners";
import { PartnerAssignedCourse, PartnerProfile } from "../types/partner";
import { ApiError } from "../types/api";

export interface PartnerDashboardContextType {
  // Partner profile
  partnerProfile: PartnerProfile | null;
  isLoading: boolean;
  error: string | null;
  /** True when the user has no partner profile (404) */
  notFound: boolean;
  reload: () => Promise<void>;

  // Assigned courses
  courses: PartnerAssignedCourse[];

  // Active course selection (shared across dashboard pages)
  activeCourseId: string;
  setActiveCourseId: (courseId: string) => void;
  activeCourse: PartnerAssignedCourse | null;
}

export const PartnerDashboardContext = createContext<PartnerDashboardContextType | undefined>(
  undefined
);

interface PartnerDashboardProviderProps {
  children: ReactNode;
}

export const PartnerDashboardProvider: React.FC<PartnerDashboardProviderProps> = ({ children }) => {
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState("");

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const profile = await getMyPartnerProfile();
      setPartnerProfile(profile);
      // Default the active course to the first assigned course (if any)
      setActiveCourseId((current) => current || profile.courses[0]?.id || "");
    } catch (err) {
      const apiError = err as ApiError;
      setPartnerProfile(null);
      if (apiError.status === 404) {
        setNotFound(true);
      } else {
        setError(apiError.message ?? "Failed to load partner profile");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const courses = partnerProfile?.courses ?? [];
  const activeCourse = courses.find((course) => course.id === activeCourseId) ?? null;

  const value: PartnerDashboardContextType = {
    partnerProfile,
    isLoading,
    error,
    notFound,
    reload,
    courses,
    activeCourseId,
    setActiveCourseId,
    activeCourse,
  };

  return (
    <PartnerDashboardContext.Provider value={value}>{children}</PartnerDashboardContext.Provider>
  );
};
