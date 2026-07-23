import { StudentOffer } from "./types";
import { ArrowRight, Check, Loader2 } from "lucide-react";

interface OfferCardFooterProps {
  offer: StudentOffer;
  hasApplied: boolean;
  canWithdraw: boolean;
  isLoading: boolean;
  onApply: (id: string) => void;
  onWithdraw: (id: string) => void;
  onViewDetails: (offer: StudentOffer) => void;
}

/** Shared card footer: View Details + the Apply / Applied+Withdraw action. */
export default function OfferCardFooter({
  offer,
  hasApplied,
  canWithdraw,
  isLoading,
  onApply,
  onWithdraw,
  onViewDetails,
}: OfferCardFooterProps) {
  return (
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
        <div className="flex items-center gap-x-2">
          <span className="inline-flex items-center gap-x-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800">
            <Check className="size-3.5" />
            Applied
          </span>
          {canWithdraw && (
            <button
              type="button"
              onClick={() => onWithdraw(offer.id)}
              disabled={isLoading}
              className="text-xs font-semibold text-gray-500 hover:text-red-600 focus:outline-none disabled:opacity-50"
            >
              Withdraw
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onApply(offer.id)}
          disabled={isLoading}
          className="inline-flex items-center gap-x-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition disabled:opacity-50"
        >
          {isLoading && <Loader2 className="size-3.5 animate-spin" />}
          Apply
        </button>
      )}
    </div>
  );
}
