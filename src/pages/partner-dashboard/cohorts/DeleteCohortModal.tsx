import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import { deleteCohort } from "../../../services/api/cohorts";
import { Cohort } from "../../../types/cohorts";
import { ApiError } from "../../../types/api";
import { toast } from "../../../components/toast";

interface DeleteCohortModalProps {
  cohort: Cohort | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteCohortModal({ cohort, onClose, onDeleted }: DeleteCohortModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (!cohort) return;

    setIsSubmitting(true);
    try {
      await deleteCohort(cohort.id);
      onDeleted();
      onClose();
      toast.success(`"${cohort.name}" deleted`);
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to delete cohort");
    } finally {
      setIsSubmitting(false);
    }
  };

  const memberCount = cohort?.members?.length ?? 0;

  return (
    <Modal
      isOpen={cohort !== null}
      onClose={handleClose}
      title="Delete cohort?"
      size="sm"
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="p-4 sm:p-6">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="size-5" />
          </span>

          <div className="text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-800">{cohort?.name}</span> will be
              permanently deleted. This can't be undone.
            </p>
            {memberCount > 0 && (
              <p className="mt-2">
                {memberCount} {memberCount === 1 ? "member" : "members"} will lose their cohort
                assignment.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Delete Cohort
          </button>
        </div>
      </div>
    </Modal>
  );
}
