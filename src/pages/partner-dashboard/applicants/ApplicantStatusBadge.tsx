import type { OfferApplicationStatus } from "../../../types/offers";
import { statusConfig } from "./statusConfig";

interface ApplicantStatusBadgeProps {
  status: OfferApplicationStatus;
}

export default function ApplicantStatusBadge({ status }: ApplicantStatusBadgeProps) {
  const { label, className } = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}
