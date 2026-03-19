import { BookOpen } from "lucide-react";
import type { Section } from "../types/modules";

interface CourseSectionsPreviewProps {
  sections?: Section[];
}

/**
 * Course Sections Preview - displays a list of course sections with name and description
 * Renders nothing if sections is empty/undefined
 */
export default function CourseSectionsPreview({ sections }: CourseSectionsPreviewProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
      <div className="space-y-4">
        {sortedSections.map((section, index) => (
          <div
            key={section.id}
            className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors duration-200"
          >
            {/* Section number */}
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
            </div>

            {/* Section content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 truncate">{section.name}</h3>
              </div>
              {section.description && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{section.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
