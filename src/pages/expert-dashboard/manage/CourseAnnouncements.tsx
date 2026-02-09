import { useState } from "react";
import { useExpertDashboardContext } from "../../../contexts";

export default function CourseAnnouncements() {
  const { courseManageData } = useExpertDashboardContext();
  const { announcements } = courseManageData;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="space-y-4">
          <p className="mt-1 text-sm text-gray-500">
            Create announcement messages that automatically sends to students.
          </p>
      </div>
    </div>
  );
}
