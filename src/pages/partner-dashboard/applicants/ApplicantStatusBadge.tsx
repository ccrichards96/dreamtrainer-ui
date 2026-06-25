import { ApplicantStatus } from "./types";
import { statusConfig } from "./statusConfig";

interface ApplicantStatusBadgeProps {
  status: ApplicantStatus;
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
