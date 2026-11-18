import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import CourseSelector from "../shared/CourseSelector";
import Pagination from "../shared/Pagination";
import CohortFilters from "../cohorts/CohortFilters";
import CohortsTable from "../cohorts/CohortsTable";
import { listCohorts, updateCohort } from "../../../services/api/cohorts";
import { Cohort, CohortStatus } from "../../../types/cohorts";
import { ApiError } from "../../../types/api";
import { usePartnerDashboardContext } from "../../../contexts/usePartnerDashboardContext";
import CreateCohortModal from "../cohorts/CreateCohortModal";
import EditCohortModal from "../cohorts/EditCohortModal";
import ManageMembersModal from "../cohorts/ManageMembersModal";
import DeleteCohortModal from "../cohorts/DeleteCohortModal";

const PAGE_SIZE = 10;

export default function Cohorts() {
  const { courses, activeCourseId, setActiveCourseId } = usePartnerDashboardContext();

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [managingCohort, setManagingCohort] = useState<Cohort | null>(null);
  const [deletingCohort, setDeletingCohort] = useState<Cohort | null>(null);

  // `draftName` tracks the input; `appliedName` filters the results (on Search).
  const [draftName, setDraftName] = useState("");
  const [appliedName, setAppliedName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadCohorts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listCohorts(activeCourseId || undefined);
      setCohorts(data);
    } catch (err) {
      setError((err as ApiError).message ?? "Failed to load cohorts");
      setCohorts([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeCourseId]);

  useEffect(() => {
    loadCohorts();
  }, [loadCohorts]);

  // The API filters by course only; cohort-name search is applied client-side.
  const filteredCohorts = useMemo(() => {
    const query = appliedName.trim().toLowerCase();
    if (!query) return cohorts;
    return cohorts.filter((cohort) => cohort.name.toLowerCase().includes(query));
  }, [cohorts, appliedName]);

  const totalPages = Math.max(1, Math.ceil(filteredCohorts.length / PAGE_SIZE));
  const pageCohorts = filteredCohorts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = () => {
    setAppliedName(draftName);
    setCurrentPage(1);
  };

  const handleStatusChange = async (cohort: Cohort, status: CohortStatus) => {
    const previous = cohorts;
    // Optimistic update
    setCohorts((prev) => prev.map((c) => (c.id === cohort.id ? { ...c, status } : c)));
    try {
      await updateCohort(cohort.id, { status });
    } catch {
      setCohorts(previous); // revert on failure
    }
  };

  const handleDelete = (cohort: Cohort) => {
    setDeletingCohort(cohort);
  };

  const handleAddCohort = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (cohort: Cohort) => {
    setEditingCohort(cohort);
  };

  const handleManageMembers = (cohort: Cohort) => {
    setManagingCohort(cohort);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <CourseSelector
          courses={courses}
          selectedCourseId={activeCourseId}
          onChange={setActiveCourseId}
        />
        <button
          type="button"
          onClick={handleAddCohort}
          className="inline-flex items-center gap-x-2 self-start rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 sm:self-end"
        >
          <Plus className="size-4" />
          Add New Cohort
        </button>
      </div>

      <CohortFilters name={draftName} onNameChange={setDraftName} onSearch={handleSearch} />

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <CohortsTable
          cohorts={pageCohorts}
          isLoading={isLoading}
          error={error}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onManageMembers={handleManageMembers}
          onDelete={handleDelete}
        />

        <div className="mt-8 pb-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            label="Cohorts pagination"
          />
        </div>
      </div>

      <CreateCohortModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        courses={courses}
        activeCourseId={activeCourseId}
        onSuccess={loadCohorts}
      />

      <EditCohortModal
        isOpen={editingCohort !== null}
        onClose={() => setEditingCohort(null)}
        cohort={editingCohort}
        onSuccess={loadCohorts}
      />

      <ManageMembersModal
        cohort={managingCohort}
        onClose={() => setManagingCohort(null)}
        onMemberRemoved={loadCohorts}
      />

      <DeleteCohortModal
        cohort={deletingCohort}
        onClose={() => setDeletingCohort(null)}
        onDeleted={loadCohorts}
      />
    </div>
  );
}
