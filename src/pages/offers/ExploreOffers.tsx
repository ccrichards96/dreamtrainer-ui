import React, { useState } from "react";
import { StudentOffer } from "./types";
import { Building, ImageIcon } from "lucide-react";
import OfferCardFooter from "./OfferCardFooter";
import PageHero from "../../components/PageHero";

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
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <PageHero
        title="Explore Offers"
        subtitle="Find and apply to course-aligned internships, design apprenticeships, and entry-level developer positions."
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: "Search offers, partners, or keywords...",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Offers List — full-width cards matching the /courses layout */}
        {filteredOffers.length > 0 ? (
          <div className="space-y-6">
            {filteredOffers.map((offer, index) => {
              const hasApplied = appliedIds.includes(offer.id);
              const logoGradient = gradientStyles[index % gradientStyles.length];

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Left side - Cover image */}
                    <div className="relative h-52 md:h-auto md:min-h-[300px] md:w-[400px] flex-shrink-0 bg-gray-100">
                      {offer.imageUrl ? (
                        <img
                          src={offer.imageUrl}
                          alt={offer.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="size-16 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Right side - Content */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex-1 p-6 space-y-4">
                        {/* Partner */}
                        <div className="flex items-center gap-x-3">
                          {offer.partnerLogoUrl ? (
                            <img
                              src={offer.partnerLogoUrl}
                              alt=""
                              className="size-10 flex-shrink-0 rounded-xl object-cover shadow-sm"
                            />
                          ) : (
                            <div
                              className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${logoGradient} text-white font-bold text-sm shadow-sm flex-shrink-0`}
                            >
                              {getInitials(offer.partnerName || offer.title)}
                            </div>
                          )}
                          {offer.partnerName && (
                            <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider truncate">
                              {offer.partnerName}
                            </h4>
                          )}
                        </div>

                        {/* Title and description */}
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{offer.title}</h2>
                          {offer.description && (
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {offer.description}
                            </p>
                          )}
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
                  </div>
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
    </>
  );
}
