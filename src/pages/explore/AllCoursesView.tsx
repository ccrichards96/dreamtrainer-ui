import { BookOpen, ArrowRight } from "lucide-react";
import type { CourseGroup } from "../../types/modules";

interface AllCoursesViewProps {
  courseGroups: CourseGroup[];
  onSelectGroup: (group: CourseGroup) => void;
}

export const AllCoursesView = ({ courseGroups, onSelectGroup }: AllCoursesViewProps) => {
  if (courseGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No course groups found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {courseGroups.map((group, index) => (
        <div
          key={group.id}
          onClick={() => onSelectGroup(group)}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer min-h-[300px] animate-in slide-in-from-bottom-4 fade-in"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
        >
          <div className="flex flex-col md:flex-row h-full">
            {/* Left side - Image with overlay */}
            <div className="relative md:w-72 h-52 md:min-h-[300px] bg-gradient-to-br from-[#c5a8de] to-[#b399d6] flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white opacity-20">
                  <BookOpen className="w-32 h-32" />
                </div>
              </div>
              {group.image && (
                <img
                  src={group.image}
                  alt={group.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>

            {/* Right side - Content */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              {/* Title and subtitle */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h2>
                <p className="text-sm text-gray-600">
                  {group.description || "A comprehensive course group to master your skills"}
                </p>
              </div>

              {/* Badge and Button row */}
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  *New Sections Available
                </span>
                <button className="px-8 py-3 bg-gray-900 text-white text-base font-medium rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2">
                  View Sections
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
