import { useParams } from "react-router-dom";
import ExpertDashboardLayout from "./ExpertDashboardLayout";
import Courses from "./core/Courses";
import Communications from "./core/Communications";
import { CourseDashboard } from "../dashboard";

/** Platform course that walks new experts through building and launching their course. */
const EXPERT_ONBOARDING_COURSE_SLUG = "launch-your-course";

type Tab = "start" | "courses" | "communications";

const validTabs: Tab[] = ["start", "courses", "communications"];

export default function ExpertDashboard() {
  const { tab } = useParams<{ tab?: string }>();

  // Unknown or retired tabs (getting-started, performance, support) land on Start & Succeed
  const activeTab: Tab = validTabs.includes(tab as Tab) ? (tab as Tab) : "start";

  return (
    <ExpertDashboardLayout>
      {activeTab === "start" ? (
        // Same course dashboard students get, pointed at the expert onboarding course
        <CourseDashboard slug={EXPERT_ONBOARDING_COURSE_SLUG} audience="expert" />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "courses" && <Courses />}
          {activeTab === "communications" && <Communications />}
        </div>
      )}
    </ExpertDashboardLayout>
  );
}
