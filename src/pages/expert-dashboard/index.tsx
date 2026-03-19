import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, MessageSquare, BarChart3, HelpCircle } from "lucide-react";
import DashboardLayout, { type SidebarItem } from "./DashboardLayout";
import Courses from "./core/Courses";
import Communications from "./core/Communications";
import GettingStarted from "./core/GettingStarted";
import Performance from "./core/Performance";
import { getExpertPerformance } from "../../services/api/experts";
import { ExpertPerformanceData } from "../../types/expert";

type Tab = "getting-started" | "courses" | "communications" | "performance" | "support";

const navItems: SidebarItem[] = [
  { id: "getting-started", label: "Getting Started", icon: BookOpen },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "communications", label: "Communications", icon: MessageSquare },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "support", label: "Support", icon: HelpCircle },
];

const validTabs: Tab[] = ["getting-started", "courses", "communications", "performance", "support"];

export default function ExpertDashboard() {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();

  const activeTab: Tab = validTabs.includes(tab as Tab) ? (tab as Tab) : "courses";

  const [performanceData, setPerformanceData] = useState<ExpertPerformanceData | null>(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);

  useEffect(() => {
    setPerformanceLoading(true);
    const fetchPerformanceData = async () => {
      try {
        const performanceData = await getExpertPerformance();
        setPerformanceData(performanceData);
      } catch (error) {
        setPerformanceData(null);
      } finally {
        setPerformanceLoading(false);
      }
    };
    fetchPerformanceData();
  }, []);

  return (
    <DashboardLayout
      items={navItems}
      activeTab={activeTab}
      onTabChange={(id) => navigate(`/expert/dashboard/${id}`)}
      title="Expert Dashboard"
      breadcrumbRoot="Expert Dashboard"
    >
      {activeTab === "getting-started" && <GettingStarted />}
      {activeTab === "courses" && <Courses />}
      {activeTab === "communications" && <Communications />}
      {activeTab === "performance" && (
        <Performance data={performanceData} isLoading={performanceLoading} />
      )}
      {activeTab === "support" && (
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Support</h1>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
