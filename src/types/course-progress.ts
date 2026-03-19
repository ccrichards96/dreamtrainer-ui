// CourseProgress types based on API documentation
export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  progressStatus: "Not Started" | "In Progress" | "Completed";
  percentageComplete: number;
  currentModuleId: string | null;
  completedModuleIds: string[];
  completedTestIds: string[];
  currentTestId: string | null;
  dateStarted: string | null;
  dateCompleted: string | null;
  currentSectionId: string | null;
  completedSectionIds: string[];
}

export interface UpdateProgressDTO {
  percentageComplete: number;
  currentModuleId?: string | null;
  completedModuleIds?: string[];
  completedTestIds?: string[];
  currentTestId?: string | null;
  currentSectionId?: string | null;
  completedSectionIds?: string[];
}
