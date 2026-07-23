import { useEffect, useMemo, useState } from "react";
import CourseSelector from "../shared/CourseSelector";
import Pagination from "../shared/Pagination";
import ApplicantFilters from "../applicants/ApplicantFilters";
import ApplicantsTable from "../applicants/ApplicantsTable";
import ViewApplicationModal from "../applicants/ViewApplicationModal";
import ViewProfileModal from "../applicants/ViewProfileModal";
import {
  Applicant,
  ApplicantAction,
  ApplicantFilterValues,
  ApplicantStatus,
} from "../applicants/types";
import { getCourseApplicants } from "../../../services/api/offers";
import { listCohortsByCourse, listCohortMembers } from "../../../services/api/cohorts";
import { CourseApplicant, OfferApplicationStatus } from "../../../types/offers";
import { Cohort } from "../../../types/cohorts";
import { ApiError } from "../../../services/api/client";
import { usePartnerDashboardContext } from "../../../contexts/usePartnerDashboardContext";

const PAGE_SIZE = 7;

const emptyFilters: ApplicantFilterValues = {
  studentName: "",
  cohortId: "",
  status: "all",
};

/** Map the real application status onto the existing display enum. The review queue only ever
 * returns "pending" today, but we translate the others for forward-compatibility. */
const statusFromApplication = (status: OfferApplicationStatus): ApplicantStatus => {
  switch (status) {
    case "approved":
      return ApplicantStatus.OfferAccepted;
    case "rejected":
    case "withdrawn":
      return ApplicantStatus.Declined;
    case "pending":
    default:
      return ApplicantStatus.New;
  }
};

/** Adapt a course applicant from the API into the shape the applicants table renders.
 * `cohortId` is resolved from the applicant user's cohort membership (see the fetch below),
 * since applications and cohorts are otherwise decoupled in the API. */
const toApplicant = (record: CourseApplicant, cohortId: string | null): Applicant => {
  const name = `${record.user.firstName ?? ""} ${record.user.lastName ?? ""}`.trim();
  return {
    id: record.id,
    appliedAt: record.appliedAt,
    name: name || record.user.email,
    avatarUrl: record.user.avatarUrl ?? undefined,
    // The student User has no bio field; surface their email + the offer they applied to instead.
    bio: [record.user.email, record.courseOffer?.title].filter(Boolean).join(" · "),
    status: statusFromApplication(record.status),
    cohortId,
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

  const handleAssignCohort = (applicantId: string, cohortId: string) => {
    setApplicants((prev) =>
      prev.map((applicant) =>
        applicant.id === applicantId ? { ...applicant, cohortId } : applicant
      )
    );
  };

  const handleAction = (action: ApplicantAction, applicant: Applicant) => {
    switch (action) {
      case "schedule_meeting":
        setApplicants((prev) =>
          prev.map((a) =>
            a.id === applicant.id ? { ...a, status: ApplicantStatus.MeetingScheduled } : a
          )
        );
        break;
      case "submit_offer":
        setApplicants((prev) =>
          prev.map((a) =>
            a.id === applicant.id ? { ...a, status: ApplicantStatus.PendingOfferResponse } : a
          )
        );
        break;
      case "move_to_not_selected":
        setApplicants((prev) =>
          prev.map((a) => (a.id === applicant.id ? { ...a, status: ApplicantStatus.Declined } : a))
        );
        break;
      case "view_application":
        setViewingApplication(applicant);
        break;
      case "view_profile":
        setViewingProfile(applicant);
        break;
    }
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
        onClose={() => setViewingApplication(null)}
      />

      <ViewProfileModal applicant={viewingProfile} onClose={() => setViewingProfile(null)} />
    </div>
  );
}
