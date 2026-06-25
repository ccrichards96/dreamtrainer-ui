import { useParams } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import PartnerShell, { type PartnerTab } from "./PartnerShell";
import Dashboard from "./core/Dashboard";
import Offers from "./core/Offers";
import Applicants from "./core/Applicants";
import Cohorts from "./core/Cohorts";

const validTabs: PartnerTab[] = ["dashboard", "offers", "applicants", "cohorts", "support"];

export default function PartnerDashboard() {
  const { tab } = useParams<{ tab?: string }>();

  const activeTab: PartnerTab = validTabs.includes(tab as PartnerTab)
    ? (tab as PartnerTab)
    : "dashboard";

  return (
    <PartnerShell activeTab={activeTab}>
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "offers" && <Offers />}
      {activeTab === "applicants" && <Applicants />}
      {activeTab === "cohorts" && <Cohorts />}
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
                    The Dream Trainer team is here to support you and your partnership.
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      )}
    </PartnerShell>
  );
}
