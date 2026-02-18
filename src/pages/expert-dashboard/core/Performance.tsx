import { useState } from "react";

type PerformanceTab = "overview" | "revenue" | "students" | "reviews" | "traffic" | "affiliates";

const performanceTabs: { id: PerformanceTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "revenue", label: "Revenue" },
  { id: "students", label: "Students" },
  { id: "reviews", label: "Reviews" },
  { id: "traffic", label: "Traffic & Conversion" },
  { id: "affiliates", label: "Affiliates" },
];

export default function Performance() {
  const [activeSubTab, setActiveSubTab] = useState<PerformanceTab>("overview");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Performance</h1>

      {/* Sub-tab navigation */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Performance tabs">
          {performanceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition
                ${
                  activeSubTab === tab.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sub-tab content */}
      <div className="mt-6">
        {activeSubTab === "overview" && (
          <div>
            <p className="text-gray-600">Performance overview and key metrics.</p>
          </div>
        )}
        {activeSubTab === "revenue" && (
          <div>
            <p className="text-gray-600">Revenue breakdown and earnings.</p>
          </div>
        )}
        {activeSubTab === "students" && (
          <div>
            <p className="text-gray-600">Student enrollment and engagement metrics.</p>
          </div>
        )}
        {activeSubTab === "reviews" && (
          <div>
            <p className="text-gray-600">Course reviews and ratings.</p>
          </div>
        )}
        {activeSubTab === "traffic" && (
          <div>
            <p className="text-gray-600">Traffic sources and conversion rates.</p>
          </div>
        )}
        {activeSubTab === "affiliates" && (
          <div>
            <p className="text-gray-600">Affiliate performance and referrals.</p>
          </div>
        )}
      </div>
    </div>
  );
}
