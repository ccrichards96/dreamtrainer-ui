import { useNavigate } from "react-router-dom";
import { useApp } from "../../../contexts/useAppContext";

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
    image: "https://img.icons8.com/?size=100&id=4DqMzI0F7ksp&format=png&color=4c1d95",
  },
    {
    id: "offers",
    label: "View Offers",
    to: "/partner/dashboard/offers",
    image: "https://img.icons8.com/?size=100&id=8291&format=png&color=4c1d95",
  },
  {
    id: "cohorts",
    label: "View Cohorts",
    to: "/partner/dashboard/cohorts",
    image: "https://img.icons8.com/?size=100&id=9542&format=png&color=4c1d95",
  },
  {
    id: "support",
    label: "Partner Support",
    to: "/partner/dashboard/support",
    image: "https://img.icons8.com/?size=100&id=7857&format=png&color=4c1d95",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { userProfile } = useApp();

  const firstName = userProfile?.firstName || "there";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Welcome, {firstName}</h1>

      {/* Quickstart */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 underline underline-offset-4">
          Quickstart
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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
      {/* <section className="mt-8">
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
      </section> */}
    </div>
  );
}
