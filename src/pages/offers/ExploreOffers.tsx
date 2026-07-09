import React, { useState } from "react";
import { StudentOffer } from "./types";
import { Search, Building, ArrowRight, Check } from "lucide-react";

interface ExploreOffersProps {
  offers: StudentOffer[];
  appliedIds: string[];
  onApply: (id: string) => void;
  onViewDetails: (offer: StudentOffer) => void;
}

const ALL_FILTER_TAGS = ["All", "Remote", "Part-Time", "UX/UI", "Frontend", "Data Analytics", "Internship"];

export default function ExploreOffers({
  offers,
  appliedIds,
  onApply,
  onViewDetails,
}: ExploreOffersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === "All" ||
      offer.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Explore Offers</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Find and apply to course-aligned internships, design apprenticeships, and entry-level developer positions.
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

                  {/* Tags */}
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

                  {/* Requirements Snippet */}
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

                  {hasApplied ? (
                    <span className="inline-flex items-center gap-x-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800">
                      <Check className="size-3.5" />
                      Applied
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onApply(offer.id)}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
                    >
                      Apply
                    </button>
                  )}
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
  );
}
