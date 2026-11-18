import { ChevronDown } from "lucide-react";
import { Course } from "./types";

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseId: string;
  onChange: (courseId: string) => void;
}

export default function CourseSelector({
  courses,
  selectedCourseId,
  onChange,
}: CourseSelectorProps) {
  return (
    <div className="max-w-md">
      <label htmlFor="active-course" className="block text-sm text-gray-600 mb-1.5">
        Select active course
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-7 rounded-full bg-gray-200" />
        <select
          id="active-course"
          value={selectedCourseId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl bg-white py-4 pl-14 pr-12 text-base font-semibold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-5 text-purple-500" />
      </div>
    </div>
  );
}
