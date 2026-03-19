import { useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Save } from "lucide-react";
import DynamicFieldSection from "../../../components/DynamicFieldSection";
import { useExpertDashboardContext } from "../../../contexts";
import { updateCourse } from "../../../services/api/modules";
import ManagePageHeader from "./ManagePageHeader";

export default function CoursePlan() {
  const { id: courseId } = useParams<{ id: string }>();
  const { courseManageData, updateCoursePlan } = useExpertDashboardContext();
  const { coursePlan } = courseManageData;

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const initialSnapshot = useRef({
    learningObjectives: coursePlan.learningObjectives,
    prerequisites: coursePlan.prerequisites,
    targetAudience: coursePlan.targetAudience,
  });

  const markDirty = useCallback(() => {
    setIsDirty(true);
    setSaveMessage(null);
  }, []);

  const handleChange = (field: keyof typeof coursePlan, value: string[]) => {
    updateCoursePlan({ [field]: value });
    markDirty();
  };

  const handleSave = async () => {
    if (!courseId || !isDirty) return;

    setIsSaving(true);
    setSaveMessage(null);
    try {
      const nonEmptyObjectives = coursePlan.learningObjectives.filter((v) => v.trim());
      const nonEmptyPrereqs = coursePlan.prerequisites.filter((v) => v.trim());
      const nonEmptyAudience = coursePlan.targetAudience.filter((v) => v.trim());

      await updateCourse(courseId, {
        learningObjectives: nonEmptyObjectives,
        prerequisites: nonEmptyPrereqs,
        targetAudiences: nonEmptyAudience,
      });

      initialSnapshot.current = {
        learningObjectives: coursePlan.learningObjectives,
        prerequisites: coursePlan.prerequisites,
        targetAudience: coursePlan.targetAudience,
      };
      setIsDirty(false);
      setSaveMessage({ type: "success", text: "Changes saved successfully." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save changes.";
      setSaveMessage({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <ManagePageHeader
        title="Course Plan & Outcomes"
        actions={
          <>
            {saveMessage && (
              <span
                className={`text-sm ${saveMessage.type === "success" ? "text-green-600" : "text-red-600"}`}
              >
                {saveMessage.text}
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="inline-flex items-center gap-x-1.5 py-2.5 px-5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </>
        }
      />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <DynamicFieldSection
          title="What will students learn?"
          description="Enter 1 learning objective or outcome per line. (Minimum 3 required)"
          value={coursePlan.learningObjectives}
          onChange={(value) => handleChange("learningObjectives", value)}
          placeholder="e.g., Build a full-stack web application from scratch"
          minFields={3}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <DynamicFieldSection
          title="What are the requirements or prerequisites for taking your course?"
          description="List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, you can leave this section empty."
          value={coursePlan.prerequisites}
          onChange={(value) => handleChange("prerequisites", value)}
          placeholder="e.g., Basic understanding of HTML and CSS"
          minFields={1}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <DynamicFieldSection
          title="Who is this course for?"
          description="Describe your ideal student. Who would benefit most from this course?"
          value={coursePlan.targetAudience}
          onChange={(value) => handleChange("targetAudience", value)}
          placeholder="e.g., Beginners looking to start a career in web development"
          minFields={1}
        />
      </div>
    </div>
  );
}
