import { useEffect, useMemo, useState } from "react";
import CourseSelector from "../shared/CourseSelector";
import Pagination from "../shared/Pagination";
import ApplicantFilters from "../applicants/ApplicantFilters";
import ApplicantsTable from "../applicants/ApplicantsTable";
import ViewApplicationModal from "../applicants/ViewApplicationModal";
import ViewProfileModal from "../applicants/ViewProfileModal";
import ScheduleMeetingModal from "../applicants/ScheduleMeetingModal";
import { Applicant, ApplicantAction, ApplicantFilterValues } from "../applicants/types";
import { statusConfig } from "../applicants/statusConfig";
import { getCourseApplicants, updateApplicantStatus } from "../../../services/api/offers";
import {
  listCohortsByCourse,
  listCohortMembers,
  addCohortMembers,
  removeCohortMember,
} from "../../../services/api/cohorts";
import { CourseApplicant, OfferApplicationStatus } from "../../../types/offers";
import { Cohort } from "../../../types/cohorts";
import { ApiError } from "../../../services/api/client";
import { toast } from "../../../components/toast";
import { usePartnerDashboardContext } from "../../../contexts/usePartnerDashboardContext";

const PAGE_SIZE = 7;

const emptyFilters: ApplicantFilterValues = {
  studentName: "",
  cohortId: "",
  status: "all",
};

/** The status each partner-driven action moves an applicant to. */
const actionStatus: Partial<Record<ApplicantAction, OfferApplicationStatus>> = {
  request_meeting: "meeting_requested",
  schedule_meeting: "meeting_scheduled",
  complete_meeting: "meeting_completed",
  submit_offer: "offer_made",
  move_to_not_selected: "declined",
};

/** Adapt a course applicant from the API into the shape the applicants table renders.
 * `cohortId` is resolved from the applicant user's cohort membership (see the fetch below),
 * since applications and cohorts are otherwise decoupled in the API. */
const toApplicant = (record: CourseApplicant, cohortId: string | null): Applicant => {
  const name = `${record.user.firstName ?? ""} ${record.user.lastName ?? ""}`.trim();
  return {
    id: record.id,
    userId: record.userId,
    appliedAt: record.appliedAt,
    name: name || record.user.email,
    email: record.user.email,
    avatarUrl: record.user.avatarUrl ?? undefined,
    // The student User has no bio field; surface their email + the offer they applied to instead.
    bio: [record.user.email, record.courseOffer?.title].filter(Boolean).join(" · "),
    status: record.status,
    cohortId,
    offer: record.courseOffer,
    reviewedAt: record.reviewedAt,
    meetingAt: record.meetingAt,
    updatedAt: record.updatedAt,
  };
};

export default function Applicants() {
  const { courses, activeCourseId, setActiveCourseId } = usePartnerDashboardContext();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // `draftFilters` track the form; `appliedFilters` drive the results (committed on Search).
  const [draftFilters, setDraftFilters] = useState<ApplicantFilterValues>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<ApplicantFilterValues>(emptyFilters);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!activeCourseId) {
      setApplicants([]);
      setCohorts([]);
      return;
    }

    let cancelled = false;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [applicantData, cohortData] = await Promise.all([
          getCourseApplicants(activeCourseId),
          // Cohorts power the filter/assignment dropdowns; a failure here shouldn't block applicants.
          listCohortsByCourse(activeCourseId).catch(() => [] as Cohort[]),
        ]);

        // Applications aren't linked to cohorts in the API, so resolve each applicant's cohort from
        // cohort membership. Best-effort: partners without cohort-manage rights just get no mapping.
        const membershipResults = await Promise.allSettled(
          cohortData.map((cohort) => listCohortMembers(cohort.id))
        );
        const userCohortId = new Map<string, string>();
        membershipResults.forEach((result, index) => {
          if (result.status !== "fulfilled") return;
          for (const member of result.value) {
            if (member.status !== "removed" && !userCohortId.has(member.userId)) {
              userCohortId.set(member.userId, cohortData[index].id);
            }
          }
        });

        if (!cancelled) {
          setCohorts(cohortData);
          setApplicants(
            applicantData.map((record) =>
              toApplicant(record, userCohortId.get(record.userId) ?? null)
            )
          );
          setCurrentPage(1);
        }
      } catch (err) {
        if (!cancelled) setError((err as ApiError).message || "Failed to load applicants");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [activeCourseId]);

  // Applicant whose application is open in the modal (null = closed)
  const [viewingApplication, setViewingApplication] = useState<Applicant | null>(null);
  // Applicant whose profile is open in the modal (null = closed)
  const [viewingProfile, setViewingProfile] = useState<Applicant | null>(null);
  // Applicant whose "Schedule Meeting" modal is open (null = closed)
  const [schedulingApplicant, setSchedulingApplicant] = useState<Applicant | null>(null);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesName = applicant.name
        .toLowerCase()
        .includes(appliedFilters.studentName.trim().toLowerCase());
      const matchesCohort =
        !appliedFilters.cohortId || applicant.cohortId === appliedFilters.cohortId;
      const matchesStatus =
        appliedFilters.status === "all" || applicant.status === appliedFilters.status;
      return matchesName && matchesCohort && matchesStatus;
    });
  }, [applicants, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / PAGE_SIZE));
  const pageApplicants = filteredApplicants.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
  };

  const handleAssignCohort = async (applicantId: string, cohortId: string) => {
    const applicant = applicants.find((a) => a.id === applicantId);
    if (!applicant || applicant.cohortId === cohortId) return;

    const previousCohortId = applicant.cohortId;
    // Optimistic — reverted below if the request fails.
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicantId ? { ...a, cohortId } : a))
    );

    try {
      await addCohortMembers(cohortId, applicant.userId);
      // Membership resolution treats a user as belonging to a single cohort, so drop
      // the old membership once the new one is confirmed.
      if (previousCohortId) {
        await removeCohortMember(previousCohortId, applicant.userId).catch(() => {});
      }
      toast.success("Cohort assignment updated");
    } catch (err) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicantId ? { ...a, cohortId: previousCohortId } : a))
      );
      toast.error((err as ApiError).message || "Failed to assign cohort");
    }
  };

  const applyStatusChange = async (
    applicant: Applicant,
    nextStatus: OfferApplicationStatus,
    meetingAt?: string
  ) => {
    if (!activeCourseId) return;

    const previous = applicant.status;
    // Optimistic — reverted below if the request fails.
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === applicant.id
          ? { ...a, status: nextStatus, meetingAt: meetingAt ?? a.meetingAt }
          : a
      )
    );

    try {
      const updated = await updateApplicantStatus(
        activeCourseId,
        applicant.id,
        nextStatus,
        meetingAt
      );
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicant.id ? { ...a, status: updated.status, meetingAt: updated.meetingAt } : a
        )
      );
      toast.success(`Moved to ${statusConfig[nextStatus].label}`);
    } catch (err) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicant.id ? { ...a, status: previous } : a))
      );
      toast.error((err as ApiError).message || "Failed to update applicant status");
    }
  };

  const handleAction = async (action: ApplicantAction, applicant: Applicant) => {
    if (action === "view_application") {
      setViewingApplication(applicant);
      return;
    }
    if (action === "view_profile") {
      setViewingProfile(applicant);
      return;
    }
    if (action === "schedule_meeting") {
      setSchedulingApplicant(applicant);
      return;
    }

    const nextStatus = actionStatus[action];
    if (!nextStatus) return;
    await applyStatusChange(applicant, nextStatus);
  };

  const handleConfirmSchedule = async (meetingAt: string) => {
    if (!schedulingApplicant) return;
    const applicant = schedulingApplicant;
    setSchedulingApplicant(null);
    await applyStatusChange(applicant, "meeting_scheduled", meetingAt);
  };

  return (
    <div className="space-y-6">
      <CourseSelector
        courses={courses}
        selectedCourseId={activeCourseId}
        onChange={setActiveCourseId}
      />

      <ApplicantFilters
        values={draftFilters}
        cohorts={cohorts}
        onChange={setDraftFilters}
        onSearch={handleSearch}
      />

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          </div>
        ) : error ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <ApplicantsTable
              applicants={pageApplicants}
              cohorts={cohorts}
              onAssignCohort={handleAssignCohort}
              onAction={handleAction}
            />

            <div className="mt-8 pb-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                label="Applicants pagination"
              />
            </div>
          </>
        )}
      </div>

      <ViewApplicationModal
        applicant={viewingApplication}
        courseId={activeCourseId}
        onClose={() => setViewingApplication(null)}
      />

      <ViewProfileModal
        applicant={viewingProfile}
        cohorts={cohorts}
        onClose={() => setViewingProfile(null)}
      />

      <ScheduleMeetingModal
        applicant={schedulingApplicant}
        onClose={() => setSchedulingApplicant(null)}
        onConfirm={handleConfirmSchedule}
      />
    </div>
  );
}
