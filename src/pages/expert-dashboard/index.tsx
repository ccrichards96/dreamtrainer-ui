import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, MessageSquare, BarChart3, HelpCircle } from "lucide-react";
import DashboardLayout, { type SidebarItem } from "./DashboardLayout";
import Courses from "./core/Courses";
import Communications from "./core/Communications";
import Performance from "./core/Performance";
type Tab = "courses" | "communications" | "performance" | "support";

const navItems: SidebarItem[] = [
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "communications", label: "Communications", icon: MessageSquare },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "support", label: "Support", icon: HelpCircle },
];

const validTabs: Tab[] = ["courses", "communications", "performance", "support"];

export default function ExpertDashboard() {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();

  const activeTab: Tab = validTabs.includes(tab as Tab) ? (tab as Tab) : "courses";

  return (
    <DashboardLayout
      items={navItems}
      activeTab={activeTab}
      onTabChange={(id) => navigate(`/expert/dashboard/${id}`)}
      title="Expert Dashboard"
      breadcrumbRoot="Expert Dashboard"
    >
      {activeTab === "courses" && <Courses />}
      {activeTab === "communications" && <Communications />}
      {activeTab === "performance" && <Performance />}
      {activeTab === "support" && (
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Support</h1>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a
              href="#"
              className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition"
            >
              <div className="flex items-center gap-x-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <BookOpen className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700">
                    Teaching Center
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Find articles on Dream Trainer teaching — from course creation to marketing.
                  </p>
                </div>
              </div>
            </a>

            <a
              href="https://help.dreamtrainer.com"
              className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition"
            >
              <div className="flex items-center gap-x-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <HelpCircle className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700">
                    Help & Support
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    The Dream Trainer team is here to support you as an expert and your cohorts.
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
