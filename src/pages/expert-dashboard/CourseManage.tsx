import { useState, useEffect, useMemo } from "react";
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
  Users,
  Lock,
  Video,
} from "lucide-react";
import DashboardLayout, { type SidebarSection } from "./DashboardLayout";
import {
  CoursePlan,
  Pricing,
  Curriculum,
  Resources,
  Review,
  Launch,
  WelcomeVideo,
  CoursePageDetails,
} from "./manage";
import Affiliates from "./manage/Affliates";
import CourseAnnouncements from "./manage/CourseAnnouncements";
import CourseStudents from "./manage/CourseStudents";
//import CourseStudentLeaders from "./manage/CourseStudentLeaders";
import Expert from "./manage/Expert";
//import Stakeholders from "./manage/Stakeholders";
import { useExpertDashboardContext } from "../../contexts";

type ManageTab =
  | "plan"
  | "pricing"
  | "curriculum"
  | "resources"
  | "experts"
  | "stakeholders"
  | "affiliates"
  | "announcements"
  | "students"
  | "student-leaders"
  | "welcome-video"
  | "course-page-details"
  | "review"
  | "preview"
  | "launch";

const SUPPORT_EXPERT_TABS: ManageTab[] = ["curriculum", "resources", "announcements", "students"];

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
        <Rocket className="w-7 h-7 text-indigo-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        This feature is on its way. Check back soon for updates.
      </p>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Lock className="w-12 h-12 text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Restricted</h2>
      <p className="text-sm text-gray-500 max-w-sm">
        This section is only available to course owners. Contact the course owner for further
        assistance.
      </p>
    </div>
  );
}

const sidebarSections: SidebarSection[] = [
  {
    id: "setup",
    label: "Course Planning",
    items: [
      { id: "plan", label: "Course Plan & Outcomes", icon: ClipboardList },
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
    items: [{ id: "affiliates", label: "Referral Link & Affiliates", icon: Group }],
  },
  {
    id: "course-management",
    label: "Course Management",
    items: [
      { id: "welcome-video", label: "Welcome Video", icon: Video },
      { id: "course-page-details", label: "Course Page Details", icon: FileText },
      { id: "announcements", label: "Announcements", icon: Megaphone },
      { id: "students", label: "Students", icon: Users },
      { id: "student-leaders", label: "Student Leaders", icon: Users },
    ],
  },
  {
    id: "publish",
    label: "Publish Your Course",
    items: [
      // { id: "review", label: "Review", icon: CheckCircle },
      { id: "launch", label: "Submit for Review", icon: Rocket },
    ],
  },
];

export default function CourseManage() {
  const navigate = useNavigate();
  const { id: courseId } = useParams<{ id: string }>();
  const { loadCourse, isLoadingCourse, expertProfile, course } = useExpertDashboardContext();
  const [activeTab, setActiveTab] = useState<ManageTab>("plan");

  const isSupportExpert = useMemo(() => {
    if (!course || !expertProfile) return false;
    if (course.expertProfileId === expertProfile.id) return false;
    const assignment = expertProfile.assignedCourses?.find((ac) => ac.course.id === courseId);
    return assignment?.role === "support-expert";
  }, [course, expertProfile, courseId]);

  useEffect(() => {
    if (isSupportExpert) setActiveTab("curriculum");
  }, [isSupportExpert]);

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
    }
  }, [courseId, loadCourse]);

  const activeLabel =
    sidebarSections.flatMap((s) => s.items).find((t) => t.id === activeTab)?.label ?? "";

  const tabsWithOwnHeader: ManageTab[] = [
    "plan",
    "announcements",
    "students",
    "student-leaders",
    "curriculum",
  ];

  const renderTabContent = () => {
    if (isSupportExpert && !SUPPORT_EXPERT_TABS.includes(activeTab)) {
      return <AccessDenied />;
    }
    switch (activeTab) {
      case "plan":
        return <CoursePlan />;
      case "pricing":
        return <Pricing />;
      case "curriculum":
        return <Curriculum />;
      case "resources":
        return <Resources />;
      case "experts":
        return <Expert />;
      case "stakeholders":
        return <ComingSoon title="Stakeholders — Coming Soon" />;
      case "affiliates":
        return <Affiliates />;
      case "announcements":
        return <CourseAnnouncements />;
      case "students":
        return <CourseStudents />;
      case "student-leaders":
        return <ComingSoon title="Student Leaders — Coming Soon" />;
      case "welcome-video":
        return <WelcomeVideo />;
      case "course-page-details":
        return <CoursePageDetails />;
      case "review":
        return <ComingSoon title="Review — Coming Soon" />;
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
