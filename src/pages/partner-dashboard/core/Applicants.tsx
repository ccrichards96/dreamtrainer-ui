import { useMemo, useState } from "react";
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
import { mockApplicants, mockCohorts } from "../applicants/mockApplicants";
import { usePartnerDashboardContext } from "../../../contexts/usePartnerDashboardContext";

const PAGE_SIZE = 7;

const emptyFilters: ApplicantFilterValues = {
  studentName: "",
  cohortId: "",
  status: "all",
};

export default function Applicants() {
  const { courses, activeCourseId, setActiveCourseId } = usePartnerDashboardContext();
  const [applicants, setApplicants] = useState(mockApplicants);

  // `draftFilters` track the form; `appliedFilters` drive the results (committed on Search).
  const [draftFilters, setDraftFilters] = useState<ApplicantFilterValues>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<ApplicantFilterValues>(emptyFilters);
  const [currentPage, setCurrentPage] = useState(1);

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
        cohorts={mockCohorts}
        onChange={setDraftFilters}
        onSearch={handleSearch}
      />

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <ApplicantsTable
          applicants={pageApplicants}
          cohorts={mockCohorts}
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
      </div>

      <ViewApplicationModal
        applicant={viewingApplication}
        onClose={() => setViewingApplication(null)}
      />

      <ViewProfileModal applicant={viewingProfile} onClose={() => setViewingProfile(null)} />
    </div>
  );
}
