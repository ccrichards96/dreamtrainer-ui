import { CalendarDays, ClipboardCheck, Mail, Ticket, Users } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import ApplicantStatusBadge from "./ApplicantStatusBadge";
import { Detail, formatDate, getInitials } from "./applicantDisplay";
import { Applicant, Cohort } from "./types";

interface ViewProfileModalProps {
  applicant: Applicant | null;
  cohorts: Cohort[];
  onClose: () => void;
}

export default function ViewProfileModal({ applicant, cohorts, onClose }: ViewProfileModalProps) {
  const cohortName = applicant?.cohortId
    ? (cohorts.find((cohort) => cohort.id === applicant.cohortId)?.name ?? "—")
    : null;

  return (
    <Modal
      isOpen={applicant !== null}
      onClose={onClose}
      title={applicant ? `${applicant.name}'s Profile` : "Profile"}
      size="lg"
    >
      {applicant && (
        <div className="p-6 space-y-6">
          {/* Identity */}
          <div className="flex items-center gap-x-4">
            {applicant.avatarUrl ? (
              <img
                src={applicant.avatarUrl}
                alt=""
                className="size-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-purple-100">
                <span className="text-lg font-semibold text-purple-700">
                  {getInitials(applicant.name)}
                </span>
              </span>
            )}

            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-gray-900">{applicant.name}</h3>
              <a
                href={`mailto:${applicant.email}`}
                className="block truncate text-sm text-purple-600 hover:underline"
              >
                {applicant.email}
              </a>
              <div className="mt-2">
                <ApplicantStatusBadge status={applicant.status} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <Detail icon={CalendarDays} label="Applied on">
              {formatDate(applicant.appliedAt)}
            </Detail>

            <Detail icon={Ticket} label="Applied to">
              {applicant.offer?.title || "—"}
            </Detail>

            <Detail icon={Users} label="Cohort">
              {cohortName ?? <span className="text-gray-400">Not assigned</span>}
            </Detail>

            <Detail icon={ClipboardCheck} label="Last reviewed">
              {applicant.reviewedAt ? (
                formatDate(applicant.reviewedAt)
              ) : (
                <span className="text-gray-400">Not yet reviewed</span>
              )}
            </Detail>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-x-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 inline-flex items-center gap-x-1.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition"
            >
              Close
            </button>
            <a
              href={`mailto:${applicant.email}`}
              className="py-2.5 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition"
            >
              <Mail className="size-4" />
              Email Applicant
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
