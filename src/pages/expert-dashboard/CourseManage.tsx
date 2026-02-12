import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Target,
  DollarSign,
  BookOpen,
  FileText,
  CheckCircle,
  Rocket,
  Group,
  Megaphone,
  BriefcaseIcon,
} from "lucide-react";
import DashboardLayout, { type SidebarSection } from "./DashboardLayout";
import {
  CoursePlan,
  CourseStructure,
  Pricing,
  Curriculum,
  Resources,
  Review,
  Launch,
} from "./manage";
import Affiliates from "./manage/Affliates";
import CourseAnnouncements from "./manage/CourseAnnouncements";
import Expert from "./manage/Expert";
import Stakeholders from "./manage/Stakeholders";
import { useExpertDashboardContext } from "../../contexts";

type ManageTab =
  | "plan"
  | "structure"
  | "pricing"
  | "curriculum"
  | "resources"
  | "experts"
  | "stakeholders"
  | "affiliates"
  | "announcements"
  | "review"
  | "preview"
  | "launch";

const sidebarSections: SidebarSection[] = [
  {
    id: "setup",
    label: "Course Planning",
    items: [
      { id: "plan", label: "Course Plan & Outcomes", icon: ClipboardList },
      { id: "structure", label: "Course Structure", icon: Target },
      { id: "pricing", label: "Pricing", icon: DollarSign },
    ],
  },
  {
    id: "content",
    label: "Course Content",
    items: [
      { id: "curriculum", label: "Curriculum", icon: BookOpen },
      { id: "resources", label: "Resources", icon: FileText },
    ],
  },
    {
    id: "course-team",
    label: "Team & Collaboration",
    items: [
      { id: "experts", label: "Support Experts", icon: BookOpen },
      { id: "stakeholders", label: "Stakeholders", icon: BriefcaseIcon },
    ],
  },
  {
    id: "course-marketing",
    label: "Course Marketing",
    items: [
      { id: "affiliates", label: "Referral Link & Affiliates", icon: Group },
    ],
  },
  {
    id: "course-management",
    label: "Course Management",
    items: [
      { id: "announcements", label: "Announcements", icon: Megaphone },
    ],
  },
  {
    id: "publish",
    label: "Publish Your Course",
    items: [
      { id: "review", label: "Review", icon: CheckCircle },
      { id: "launch", label: "Submit for Review", icon: Rocket },
    ],
  },
];

export default function CourseManage() {
  const navigate = useNavigate();
  const { id: courseId } = useParams<{ id: string }>();
  const { loadCourse, isLoadingCourse } = useExpertDashboardContext();
  const [activeTab, setActiveTab] = useState<ManageTab>("plan");

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
    }
  }, [courseId, loadCourse]);

  const activeLabel =
    sidebarSections.flatMap((s) => s.items).find((t) => t.id === activeTab)?.label ?? "";

  const tabsWithOwnHeader: ManageTab[] = ["plan", "announcements"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "plan":
        return <CoursePlan />;
      case "structure":
        return <CourseStructure />;
      case "pricing":
        return <Pricing />;
      case "curriculum":
        return <Curriculum />;
      case "resources":
        return <Resources />;
      case "experts":
        return <Expert />;
      case "stakeholders":
        return <Stakeholders />;
      case "affiliates":
        return <Affiliates />;
      case "announcements":
        return <CourseAnnouncements />;
      case "review":
        return <Review />;
      case "launch":
        return <Launch />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      sections={sidebarSections}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as ManageTab)}
      title="Manage Course"
      breadcrumbRoot="Manage Course"
      sidebarHeader={
        <div className="px-5 pt-4">
          <button
            onClick={() => navigate("/expert/dashboard/courses")}
            className="inline-flex items-center gap-x-1.5 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Courses
          </button>
        </div>
      }
    >
      {isLoadingCourse ? (
        <div className="text-center py-12 text-sm text-gray-500">Loading course...</div>
      ) : (
        <>
          {!tabsWithOwnHeader.includes(activeTab) && (
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{activeLabel}</h1>
          )}
          {renderTabContent()}
        </>
      )}
    </DashboardLayout>
  );
}
