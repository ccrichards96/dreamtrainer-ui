import React, { useState } from "react";
import { StudentOffer } from "./types";
import { Search, Building } from "lucide-react";
import OfferCardFooter from "./OfferCardFooter";

interface ExploreOffersProps {
  offers: StudentOffer[];
  appliedIds: string[];
  withdrawableIds: string[];
  busyIds: string[];
  onApply: (id: string) => void;
  onWithdraw: (id: string) => void;
  onViewDetails: (offer: StudentOffer) => void;
}

export default function ExploreOffers({
  offers,
  appliedIds,
  withdrawableIds,
  busyIds,
  onApply,
  onWithdraw,
  onViewDetails,
}: ExploreOffersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOffers = offers.filter((offer) => {
    const query = searchQuery.toLowerCase();
    return (
      offer.title.toLowerCase().includes(query) ||
      (offer.partnerName?.toLowerCase().includes(query) ?? false) ||
      offer.description.toLowerCase().includes(query)
    );
  });

  // Get initials for the logo avatar fallback (falls back to the offer title when no partner name).
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Explore Offers</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Find and apply to course-aligned internships, design apprenticeships, and entry-level
          developer positions.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <label htmlFor="search-offers" className="sr-only">
            Search offers
          </label>
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
            <Search className="size-4 text-gray-400" />
          </div>
          <input
            id="search-offers"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offers, partners, or keywords..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pe-4 ps-10 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Offers Grid */}
      {filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filteredOffers.map((offer, index) => {
            const hasApplied = appliedIds.includes(offer.id);
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
                  </div>

                  {/* Tags */}
                  {/* {offer.tags && offer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {offer.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )} */}

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
                <OfferCardFooter
                  offer={offer}
                  hasApplied={hasApplied}
                  canWithdraw={withdrawableIds.includes(offer.id)}
                  isBusy={busyIds.includes(offer.id)}
                  onApply={onApply}
                  onWithdraw={onWithdraw}
                  onViewDetails={onViewDetails}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <Building className="mx-auto size-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-800">No offers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search keywords or tags to find available offers.
          </p>
        </div>
      )}
    </div>
  );
}
