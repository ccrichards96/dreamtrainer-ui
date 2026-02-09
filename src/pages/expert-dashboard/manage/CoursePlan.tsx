import DynamicFieldSection from "../../../components/DynamicFieldSection";
import { useExpertDashboardContext } from "../../../contexts";

export default function CoursePlan() {
  const { courseManageData, updateCoursePlan } = useExpertDashboardContext();
  const { coursePlan } = courseManageData;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <DynamicFieldSection
          title="What will students learn?"
          description="Enter 1 learning objective or outcome per line. (Minimum 3 required)"
          value={coursePlan.learningObjectives}
          onChange={(value) => updateCoursePlan({ learningObjectives: value })}
          placeholder="e.g., Build a full-stack web application from scratch"
          minFields={3}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <DynamicFieldSection
          title="What are the requirements or prerequisites for taking your course?"
          description="List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, you can leave this section empty."
          value={coursePlan.prerequisites}
          onChange={(value) => updateCoursePlan({ prerequisites: value })}
          placeholder="e.g., Basic understanding of HTML and CSS"
          minFields={1}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <DynamicFieldSection
          title="Who is this course for?"
          description="Describe your ideal student. Who would benefit most from this course?"
          value={coursePlan.targetAudience}
          onChange={(value) => updateCoursePlan({ targetAudience: value })}
          placeholder="e.g., Beginners looking to start a career in web development"
          minFields={1}
        />
      </div>
    </div>
  );
}
