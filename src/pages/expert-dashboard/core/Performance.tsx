import { useState } from "react";
import { ExpertPerformanceData } from "../../../types/expert";

type PerformanceTab = "overview" | "revenue" | "students" | "reviews" | "traffic" | "affiliates";

const tabs: { id: PerformanceTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "revenue", label: "Revenue" },
  { id: "students", label: "Students" },
  { id: "reviews", label: "Reviews" },
  { id: "traffic", label: "Traffic & Conversion" },
  { id: "affiliates", label: "Affiliates" },
];

interface PerformanceProps {
  data: ExpertPerformanceData | null;
  isLoading: boolean;
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default function Performance({ data, isLoading }: PerformanceProps) {
  const [active, setActive] = useState<PerformanceTab>("overview");

  const s = (v: number | string | undefined) => (isLoading ? "—" : (v ?? "—"));
  const pct = (v: number | undefined) => (isLoading ? "—" : v != null ? `${v}%` : "—");
  const usd = (v: number | undefined) => (isLoading ? "—" : v != null ? `$${v.toLocaleString()}` : "—");

  const panels: Record<PerformanceTab, { label: string; value: string | number }[]> = {
    overview: [
      { label: "Total Revenue", value: usd(data?.overview.totalRevenue) },
      { label: "Total Students", value: s(data?.overview.totalStudents) },
      { label: "Avg Rating", value: s(data?.overview.avgRating) },
      { label: "Completion Rate", value: pct(data?.overview.completionRate) },
    ],
    revenue: [
      { label: "This Month", value: usd(data?.revenue.thisMonth) },
      { label: "Last Month", value: usd(data?.revenue.lastMonth) },
      { label: "Lifetime Earnings", value: usd(data?.revenue.lifetime) },
      { label: "Pending Payout", value: usd(data?.revenue.pendingPayout) },
    ],
    students: [
      { label: "Total Students", value: s(data?.students.totalStudents) },
      { label: "New Signups This Month", value: s(data?.students.newSignupsThisMonth) },
      { label: "Active This Week", value: s(data?.students.activeThisWeek) },
      { label: "Completion Rate", value: pct(data?.students.completionRate) },
    ],
    reviews: [
      { label: "Average Rating", value: s(data?.reviews.averageRating) },
      { label: "Total Reviews", value: s(data?.reviews.totalReviews) },
      { label: "5-Star Reviews", value: s(data?.reviews.fiveStar) },
      { label: "Response Rate", value: pct(data?.reviews.responseRate) },
    ],
    traffic: [
      { label: "Page Views", value: s(data?.traffic.pageViews) },
      { label: "Unique Visitors", value: s(data?.traffic.uniqueVisitors) },
      { label: "Conversion Rate", value: pct(data?.traffic.conversionRate) },
      { label: "Top Source", value: s(data?.traffic.topSource) },
    ],
    affiliates: [
      { label: "Total Referrals", value: s(data?.affiliates.totalReferrals) },
      { label: "Active Affiliates", value: s(data?.affiliates.activeAffiliates) },
      { label: "Affiliate Revenue", value: usd(data?.affiliates.affiliateRevenue) },
      { label: "Conversion Rate", value: pct(data?.affiliates.conversionRate) },
    ],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Performance</h1>

      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Performance tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition ${
                active === t.id
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {panels[active].map((card) => (
          <Card key={card.label} label={card.label} value={card.value} />
        ))}
      </div>
    </div>
  );
}
