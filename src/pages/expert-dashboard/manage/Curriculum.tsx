import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useExpertDashboardContext } from "../../../contexts";
import { SectionManager, ModuleManager } from "../../../components/admin";
import { Section, Module } from "../../../types/modules";

type CurriculumView = "sections" | "modules";

export default function Curriculum() {
  const { course } = useExpertDashboardContext();
  const [view, setView] = useState<CurriculumView>("sections");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);

  const handleManageModules = (section: Section, modules: Module[]) => {
    setSelectedSection(section);
    setSelectedModules(modules);
    setView("modules");
  };

  const handleBackToSections = () => {
    setView("sections");
    setSelectedSection(null);
    setSelectedModules([]);
  };

  if (!course) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <p className="text-gray-600">No course loaded.</p>
      </div>
    );
  }

  if (view === "modules" && selectedSection) {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToSections}
          className="inline-flex items-center gap-x-1.5 text-sm text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="size-4" />
          Back to Sections
        </button>
        <ModuleManager section={selectedSection} modules={selectedModules} />
      </div>
    );
  }

  return (
    <SectionManager course={course} onManageModules={handleManageModules} />
  );
}
