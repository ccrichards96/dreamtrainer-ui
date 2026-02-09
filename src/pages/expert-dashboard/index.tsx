import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Loader2,
  BookOpen,
  Users,
  MessageSquare,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import DashboardLayout, { type SidebarItem } from "./DashboardLayout";
import Courses from "./core/Courses";
import Communications from "./core/Communications";
import Performance from "./core/Performance";
import Students from "./core/Students";

type Tab = "courses" | "students" | "communications" | "performance" | "support";

const navItems: SidebarItem[] = [
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "students", label: "Students", icon: Users },
  { id: "communications", label: "Communications", icon: MessageSquare },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "support", label: "Support", icon: HelpCircle },
];

const validTabs: Tab[] = ["courses", "students", "communications", "performance", "support"];

export default function ExpertDashboard() {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeTab: Tab = validTabs.includes(tab as Tab) ? (tab as Tab) : "courses";

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        // setLoading(true);
        // setError(null);

      } catch (err) {
        console.error("Error fetching expert:", err);
        setError(err instanceof Error ? err.message : "Failed to load expert profile");
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#c5a8de]" />
            <span className="ml-3 text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error || "Expert not found"}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      items={navItems}
      activeTab={activeTab}
      onTabChange={(id) => navigate(`/expert/dashboard/${id}`)}
      title="Expert Dashboard"
      breadcrumbRoot="Expert Dashboard"
    >
      {activeTab === "courses" && <Courses />}
      {activeTab === "students" && <Students />}
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
