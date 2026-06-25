import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../../../contexts/useAppContext";

// Placeholder illustration — swap for a real asset later
const PLACEHOLDER_IMAGE = "https://placehold.co/120x120/4c1d95/ffffff?text=DT";

interface QuickstartCard {
  id: string;
  label: string;
  to?: string;
  href?: string;
  image?: string;
}

const quickstartCards: QuickstartCard[] = [
  {
    id: "applicants",
    label: "View All Applicants",
    to: "/partner/dashboard/applicants",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: "cohorts",
    label: "View Cohorts",
    to: "/partner/dashboard/cohorts",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: "support",
    label: "Partner Support",
    to: "/partner/dashboard/support",
    image: PLACEHOLDER_IMAGE,
  },
];

interface Notification {
  id: string;
  title: string;
  message: string;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Student Applicants",
    message: "Cammie K. applied to the TOEFL Offer",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { userProfile } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const firstName = userProfile?.firstName || "there";

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Welcome, {firstName}</h1>

      {/* Quickstart */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 underline underline-offset-4">
          Quickstart
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickstartCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => card.to && navigate(card.to)}
              className="group flex items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition text-left min-h-[120px]"
            >
              <span className="text-lg font-semibold text-purple-600 underline underline-offset-2 group-hover:text-purple-800">
                {card.label}
              </span>
              {card.image && (
                <img src={card.image} alt="" className="size-16 shrink-0 rounded-lg object-cover" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 underline underline-offset-4">
          Notifications
        </h2>
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm min-h-[220px]">
          {notifications.length > 0 ? (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
                >
                  <div className="flex items-center gap-8">
                    <span className="font-semibold text-gray-800">{n.title}</span>
                    <span className="text-gray-600">{n.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissNotification(n.id)}
                    className="text-sm text-purple-600 underline underline-offset-2 hover:text-purple-800"
                  >
                    Dismiss
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-full min-h-[180px] items-center justify-center">
              <p className="text-sm text-gray-500">You're all caught up.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
