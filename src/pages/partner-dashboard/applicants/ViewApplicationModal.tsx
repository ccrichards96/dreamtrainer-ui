import {
  Award,
  Briefcase,
  CalendarClock,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock,
  Hash,
  Mail,
  Ticket,
} from "lucide-react";
import Modal from "../../../components/modals/Modal";
import ApplicantStatusBadge from "./ApplicantStatusBadge";
import ApplicationDocuments from "./ApplicationDocuments";
import { Detail, Empty, formatDate, formatDateTime, getInitials } from "./applicantDisplay";
import { Applicant } from "./types";

interface ViewApplicationModalProps {
  applicant: Applicant | null;
  /** Course the applicant is being reviewed under — scopes the document endpoints */
  courseId: string | null;
  onClose: () => void;
}

/** One of the three "ideal candidate" free-text panels on the offer. */
function ProfilePanel({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-x-2 text-purple-600">
        <Icon className="size-4" />
        <h5 className="text-sm font-semibold text-gray-800">{title}</h5>
      </div>
      <p className="text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

export default function ViewApplicationModal({
  applicant,
  courseId,
  onClose,
}: ViewApplicationModalProps) {
  const offer = applicant?.offer;
  const requirements = offer?.requirements ?? [];
  const hasProfile = Boolean(offer?.characteristics || offer?.expectations || offer?.outcomes);

  return (
    <Modal
      isOpen={applicant !== null}
      onClose={onClose}
      title={applicant ? `${applicant.name}'s Application` : "Application"}
      size="lg"
    >
      {applicant && (
        <div className="flex flex-col">
          {/* Applicant summary */}
          <div className="flex flex-col gap-4 border-b border-purple-100 bg-purple-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-x-4">
              {applicant.avatarUrl ? (
                <img
                  src={applicant.avatarUrl}
                  alt=""
                  className="size-14 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-purple-100">
                  <span className="text-lg font-semibold text-purple-700">
                    {getInitials(applicant.name)}
                  </span>
                </span>
              )}
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-gray-900">{applicant.name}</h3>
                <a
                  href={`mailto:${applicant.email}`}
                  className="block truncate text-sm text-purple-600 hover:underline"
                >
                  {applicant.email}
                </a>
              </div>
            </div>

            <div className="shrink-0">
              <ApplicantStatusBadge status={applicant.status} />
            </div>
          </div>

          <div className="space-y-6 p-6">
            {/* Application record */}
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                Application
              </h4>
              <div className="grid gap-5 sm:grid-cols-2">
                <Detail icon={Ticket} label="Applied to">
                  {offer?.title || <Empty>Offer unavailable</Empty>}
                </Detail>

                <Detail icon={CalendarDays} label="Submitted on">
                  {formatDate(applicant.appliedAt)}
                </Detail>

                <Detail icon={ClipboardCheck} label="Last reviewed">
                  {applicant.reviewedAt ? (
                    formatDateTime(applicant.reviewedAt)
                  ) : (
                    <Empty>Not yet reviewed</Empty>
                  )}
                </Detail>

                <Detail icon={CalendarClock} label="Meeting">
                  {applicant.meetingAt ? (
                    formatDateTime(applicant.meetingAt)
                  ) : (
                    <Empty>Not scheduled</Empty>
                  )}
                </Detail>

                <Detail icon={Hash} label="Application ID">
                  <span className="font-mono text-xs text-gray-600">{applicant.id}</span>
                </Detail>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* What the applicant submitted */}
            <ApplicationDocuments courseId={courseId} applicationId={applicant.id} />

            {/* What they applied to */}
            {offer && (
              <>
                <hr className="border-gray-200" />

                <div>
                  <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                    About the Opportunity
                  </h4>
                  {offer.partnerName && (
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                      {offer.partnerName}
                    </p>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-gray-700">
                    {offer.description || <Empty>No description provided.</Empty>}
                  </p>
                </div>

                {requirements.length > 0 && (
                  <>
                    <hr className="border-gray-200" />
                    <div>
                      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                        Requirements
                      </h4>
                      <ul className="space-y-2.5">
                        {requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-x-3 text-sm text-gray-700">
                            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                              <Check className="size-3" />
                            </div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {hasProfile && (
                  <>
                    <hr className="border-gray-200" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {offer.characteristics && (
                        <ProfilePanel
                          icon={Briefcase}
                          title="Desired Characteristics"
                          body={offer.characteristics}
                        />
                      )}
                      {offer.expectations && (
                        <ProfilePanel icon={Clock} title="Expectations" body={offer.expectations} />
                      )}
                      {offer.outcomes && (
                        <ProfilePanel icon={Award} title="Desired Outcomes" body={offer.outcomes} />
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Close
            </button>
            <a
              href={`mailto:${applicant.email}`}
              className="inline-flex items-center gap-x-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
