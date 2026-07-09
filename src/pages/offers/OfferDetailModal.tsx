import React from "react";
import Modal from "../../components/modals/Modal";
import { StudentOffer } from "./types";
import { Building, Check, Briefcase, Award, ArrowRight } from "lucide-react";

interface OfferDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: StudentOffer | null;
  hasApplied: boolean;
  onApply: () => void;
}

export default function OfferDetailModal({
  isOpen,
  onClose,
  offer,
  hasApplied,
  onApply,
}: OfferDetailModalProps) {
  if (!offer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={offer.title}
      size="lg"
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Banner / Header Info */}
        <div className="bg-purple-50 p-6 border-b border-purple-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-x-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm flex-shrink-0">
                <Building className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{offer.partnerName}</h3>
              </div>
            </div>

            <div className="flex-shrink-0">
              {hasApplied ? (
                <span className="inline-flex items-center gap-x-1.5 rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-800 border border-green-200">
                  <Check className="size-4" />
                  Applied
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onApply();
                  }}
                  className="inline-flex items-center gap-x-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
                >
                  Apply Now
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="p-6 space-y-6">
          {/* About */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
              About the Role
            </h4>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {offer.description}
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Requirements */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
              Requirements
            </h4>
            <ul className="space-y-2.5">
              {offer.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-x-3 text-gray-700 text-sm sm:text-base">
                  <div className="flex size-5 items-center justify-center rounded-full bg-purple-100 text-purple-600 mt-0.5 flex-shrink-0">
                    <Check className="size-3" />
                  </div>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-gray-200" />

          {/* Ideal Candidate Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-x-2 text-purple-600 mb-2">
                <Briefcase className="size-4" />
                <h5 className="font-semibold text-gray-800 text-sm">Traits (Desired Characteristics)</h5>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{offer.characteristics}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-x-2 text-purple-600 mb-2">
                <Clock className="size-4" />
                <h5 className="font-semibold text-gray-800 text-sm">Expectations (Behaviors)</h5>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{offer.expectations}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-x-2 text-purple-600 mb-2">
                <Award className="size-4" />
                <h5 className="font-semibold text-gray-800 text-sm">Desired Outcomes</h5>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{offer.outcomes}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Inline helper component for Clock icon in expectations
function Clock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
