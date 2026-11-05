import { StudentOffer, isApplyLocked } from "./types";
import { ArrowRight, Check, Loader2, Lock } from "lucide-react";

interface OfferCardFooterProps {
  offer: StudentOffer;
  hasApplied: boolean;
  canWithdraw: boolean;
  isBusy: boolean;
  onApply: (id: string) => void;
  onWithdraw: (id: string) => void;
  onViewDetails: (offer: StudentOffer) => void;
}

/** Shared card footer: View Details + the Apply / Applied+Withdraw action. */
export default function OfferCardFooter({
  offer,
  hasApplied,
  canWithdraw,
  isBusy,
  onApply,
  onWithdraw,
  onViewDetails,
}: OfferCardFooterProps) {
  return (
    <div className="px-6 pb-6 flex items-center justify-between gap-x-4 flex-shrink-0">
      <button
        type="button"
        onClick={() => onViewDetails(offer)}
        className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-x-1.5 focus:outline-none"
      >
        View Details
        <ArrowRight className="size-4" />
      </button>

      {hasApplied ? (
        <div className="flex items-center gap-x-2">
          <span className="inline-flex items-center gap-x-1.5 rounded-lg bg-green-100 px-6 py-3 text-base font-medium text-green-800">
            <Check className="size-5" />
            Applied
          </span>
          {canWithdraw && (
            <button
              type="button"
              onClick={() => onWithdraw(offer.id)}
              disabled={isBusy}
              className="text-sm font-semibold text-gray-500 hover:text-red-600 focus:outline-none disabled:opacity-50"
            >
              Withdraw
            </button>
          )}
        </div>
      ) : isApplyLocked(offer) ? (
        <span
          title={`Pass ${offer.courseName ? `"${offer.courseName}"` : "the course"} to apply`}
          className="inline-flex cursor-not-allowed items-center gap-x-2 rounded-lg bg-gray-200 px-6 py-3 text-base font-medium text-gray-500"
        >
          <Lock className="size-5" />
          Pass course to apply
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onApply(offer.id)}
          disabled={isBusy}
          className="inline-flex items-center gap-x-2 rounded-lg bg-purple-600 px-8 py-3 text-base font-medium text-white hover:bg-purple-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 disabled:opacity-50"
        >
          Apply
          {isBusy ? <Loader2 className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
        </button>
      )}
    </div>
  );
}
