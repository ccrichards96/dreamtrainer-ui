import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ModuleManager } from "../../components/admin";
import { Section } from "../../types/modules";
import { getSectionWithModules } from "../../services/api/modules";

const ModuleManagePage: React.FC = () => {
  const { courseId, sectionId } = useParams<{ courseId: string; sectionId: string }>();
  const navigate = useNavigate();

  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionId) return;

    setLoading(true);
    setError(null);
    getSectionWithModules(sectionId)
      .then((data) => setSection(data))
      .catch((err) => {
        console.error("Error fetching section modules:", err);
        setError("Failed to load section modules");
      })
      .finally(() => setLoading(false));
  }, [sectionId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading section modules...</p>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-red-600 mb-4">{error || "Section not found"}</p>
        <button
          onClick={() => navigate(`/admin/courses/${courseId}/sections`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Sections
        </button>
      </div>
    );
  }

  return <ModuleManager section={section} modules={section.modules || []} />;
};

export default ModuleManagePage;
