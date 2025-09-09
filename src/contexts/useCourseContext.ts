import { useContext } from "react";
import { CourseContext, CourseContextType } from "./CourseContext";

export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);

  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }

  return context;
};
