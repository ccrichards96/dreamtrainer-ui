import React from "react";
import { StudentOffer } from "./types";
import { Briefcase, Building, Clock, ArrowRight, Compass } from "lucide-react";

interface MyOffersProps {
  offers: StudentOffer[];
  appliedIds: string[];
  onViewDetails: (offer: StudentOffer) => void;
  onExploreRedirect: () => void;
}

type OfferStatus = "Applied" | "Under Review" | "Offered" | "Accepted" | "Rejected";

// Simulated mapping of status per offer ID
const getSimulatedStatus = (offerId: string): { status: OfferStatus; date: string } => {
  switch (offerId) {
    case "offer-1":
      return { status: "Applied", date: "Applied today" };
    case "offer-2":
      return { status: "Under Review", date: "Applied 3 days ago" };
    case "offer-3":
      return { status: "Offered", date: "Applied 1 week ago" };
    case "offer-4":
      return { status: "Accepted", date: "Applied 2 weeks ago" };
    default:
      return { status: "Applied", date: "Applied recently" };
  }
};

const statusBadgeClasses: Record<OfferStatus, string> = {
  "Applied": "bg-amber-50 text-amber-700 border-amber-200",
  "Under Review": "bg-blue-50 text-blue-700 border-blue-200",
  "Offered": "bg-emerald-50 text-emerald-700 border-emerald-250",
  "Accepted": "bg-purple-50 text-purple-700 border-purple-200",
  "Rejected": "bg-red-50 text-red-700 border-red-250"
};

export default function MyOffers({
  offers,
  appliedIds,
  onViewDetails,
  onExploreRedirect,
}: MyOffersProps) {
  const appliedOffers = offers.filter((offer) => appliedIds.includes(offer.id));

  // Get initials for partner logo avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Curated gradient array based on offer index
  const gradientStyles = [
    "from-purple-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-blue-500 to-teal-500",
    "from-amber-500 to-orange-500",
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Offers</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Track the status of your applications and manage your current offers.
        </p>
      </div>

      {/* Applied Offers Grid / List */}
      {appliedOffers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {appliedOffers.map((offer, index) => {
            const { status, date } = getSimulatedStatus(offer.id);
            const logoGradient = gradientStyles[index % gradientStyles.length];

            return (
              <div
                key={offer.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-150 hover:shadow-md hover:border-purple-250 transition duration-300"
              >
                {/* Card Header */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-x-4">
                    <div className="flex items-center gap-x-3">
                      {/* Logo Fallback Gradient */}
                      <div
                        className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${logoGradient} text-white font-bold text-sm shadow-sm flex-shrink-0`}
                      >
                        {getInitials(offer.partnerName)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                          {offer.partnerName}
                        </h4>
                        <h3 className="font-bold text-gray-800 text-base mt-0.5 line-clamp-1">
                          {offer.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Date and Status Line */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-x-1.5">
                      <Clock className="size-3.5 text-gray-400" />
                      <span>{date}</span>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm ${statusBadgeClasses[status]}`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="bg-gray-50 px-5 py-4 flex items-center justify-between border-t border-gray-100 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onViewDetails(offer)}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-x-1.5 focus:outline-none"
                  >
                    View Details
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <Briefcase className="mx-auto size-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-800">No applications yet</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            You haven't applied to any offers yet. Explore the available placements and launch your application.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onExploreRedirect}
              className="inline-flex items-center gap-x-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
            >
              <Compass className="size-4" />
              Browse Offers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
