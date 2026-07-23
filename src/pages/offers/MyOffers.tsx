import React from "react";
import { applicationStatusConfig } from "./statusConfig";
import { Briefcase, Compass, ArrowRight, Loader2 } from "lucide-react";
import type { MyOfferApplication, OfferApplicationStatus, CourseOffer } from "../../types/offers";

interface MyOffersProps {
  applications: MyOfferApplication[];
  statuses: Record<string, OfferApplicationStatus>;
  busyIds: string[];
  onApply: (id: string) => void;
  onWithdraw: (id: string) => void;
  onViewDetails: (offer: CourseOffer) => void;
  onExploreRedirect: () => void;
}

// Get initials for the logo avatar fallback (falls back to the offer title when no partner name).
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase();

// Curated gradient array based on card index
const gradientStyles = [
  "from-purple-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-blue-500 to-teal-500",
  "from-amber-500 to-orange-500",
];

export default function MyOffers({
  applications,
  statuses,
  busyIds,
  onApply,
  onWithdraw,
  onViewDetails,
  onExploreRedirect,
}: MyOffersProps) {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Offers</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Track the offers you've applied to and their status.
        </p>
      </div>

      {/* Applications Grid */}
      {applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {applications.map((application, index) => {
            const offer = application.courseOffer;
            const status = statuses[application.courseOfferId] ?? application.status;
            const badge = applicationStatusConfig[status];
            const logoGradient = gradientStyles[index % gradientStyles.length];
            const isBusy = busyIds.includes(offer.id);
            const canReapply = status === "withdrawn" || status === "rejected";
            const isInactive = canReapply; // greyed-out treatment for withdrawn/rejected

            return (
              <div
                key={application.id}
                className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-150 hover:shadow-md hover:border-purple-250 transition duration-300 ${
                  isInactive ? "opacity-70" : ""
                }`}
              >
                {/* Card Header */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-x-3">
                    <div className="flex items-center gap-x-3">
                      {/* Logo Fallback Gradient */}
                      <div
                        className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${logoGradient} text-white font-bold text-sm shadow-sm flex-shrink-0`}
                      >
                        {getInitials(offer.partnerName || offer.title)}
                      </div>
                      <div>
                        {offer.partnerName && (
                          <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                            {offer.partnerName}
                          </h4>
                        )}
                        <h3 className="font-bold text-gray-800 text-base mt-0.5 line-clamp-1">
                          {offer.title}
                        </h3>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`inline-flex flex-shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Requirements Snippet */}
                  {offer.requirements && offer.requirements.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Key Requirements
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {offer.requirements.slice(0, 2).map((req, idx) => (
                          <li key={idx} className="line-clamp-1 flex items-start gap-x-2">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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

                  {status === "pending" && (
                    <button
                      type="button"
                      onClick={() => onWithdraw(offer.id)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-x-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 focus:outline-none disabled:opacity-50"
                    >
                      {isBusy && <Loader2 className="size-3.5 animate-spin" />}
                      Withdraw
                    </button>
                  )}

                  {canReapply && (
                    <button
                      type="button"
                      onClick={() => onApply(offer.id)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-x-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition disabled:opacity-50"
                    >
                      {isBusy && <Loader2 className="size-3.5 animate-spin" />}
                      Re-apply
                    </button>
                  )}
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
            You haven't applied to any offers yet. Explore the available offers to get started.
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
