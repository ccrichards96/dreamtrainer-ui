// CourseProgress types based on API documentation
export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  progressStatus: "Not Started" | "In Progress" | "Completed";
  percentageComplete: number;
  dateStarted: string | null;
  dateCompleted: string | null;
}

export interface UpdateProgressDTO {
  percentageComplete: number;
}
