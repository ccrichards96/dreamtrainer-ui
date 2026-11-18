import { useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useExpertDashboardContext } from "../../../contexts";
import { SectionManager, ModuleManager } from "../../../components/admin";
import { Section } from "../../../types/modules";
import { getSectionWithModules } from "../../../services/api/modules";

type CurriculumView = "sections" | "modules";

export default function Curriculum() {
  const { course } = useExpertDashboardContext();
  const [view, setView] = useState<CurriculumView>("sections");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [loadingModules, setLoadingModules] = useState(false);
  const [modulesError, setModulesError] = useState<string | null>(null);

  // SectionManager only hands back the section — fetch it fresh with its modules
  const handleManageModules = async (section: Section) => {
    setView("modules");
    setSelectedSection(null);
    setModulesError(null);
    setLoadingModules(true);
    try {
      setSelectedSection(await getSectionWithModules(section.id));
    } catch (err) {
      console.error("Error fetching section modules:", err);
      setModulesError("Failed to load this section's modules.");
    } finally {
      setLoadingModules(false);
    }
  };

  const handleBackToSections = () => {
    setView("sections");
    setSelectedSection(null);
    setModulesError(null);
  };

  if (!course) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <p className="text-gray-600">No course loaded.</p>
      </div>
    );
  }

  if (view === "modules") {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToSections}
          className="inline-flex items-center gap-x-1.5 text-sm text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="size-4" />
          Back to Sections
        </button>
        {loadingModules ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex items-center justify-center gap-3">
            <RefreshCw className="size-5 animate-spin text-purple-600" />
            <span className="text-gray-600">Loading modules...</span>
          </div>
        ) : modulesError || !selectedSection ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <p className="text-red-600">{modulesError || "Section not found."}</p>
          </div>
        ) : (
          <ModuleManager
            key={selectedSection.id}
            section={selectedSection}
            modules={selectedSection.modules || []}
          />
        )}
      </div>
    );
  }

  return <SectionManager course={course} onManageModules={handleManageModules} />;
}
