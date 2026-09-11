import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "../modals/Modal";
import { deleteCourseLevel } from "../../services/api/course-levels";
import { CourseLevel } from "../../types/modules";
import { ApiError } from "../../types/api";
import { toast } from "../toast";

interface DeleteCourseLevelModalProps {
  courseId: string;
  level: CourseLevel | null;
  otherLevels: CourseLevel[];
  onClose: () => void;
  onDeleted: (levelId: string, reassignedToLevelId?: string) => void;
}

export default function DeleteCourseLevelModal({
  courseId,
  level,
  otherLevels,
  onClose,
  onDeleted,
}: DeleteCourseLevelModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reassignToLevelId, setReassignToLevelId] = useState("");

  const hasStudents = (level?.numberOfStudents ?? 0) > 0;

  const handleClose = () => {
    if (isSubmitting) return;
    setReassignToLevelId("");
    onClose();
  };

  const handleConfirm = async () => {
    if (!level) return;

    if (hasStudents && !reassignToLevelId) return;

    setIsSubmitting(true);
    try {
      await deleteCourseLevel(
        courseId,
        level.id,
        hasStudents ? { reassignToLevelId } : undefined
      );
      toast.success(`"${level.name}" deleted`);
      onDeleted(level.id, hasStudents ? reassignToLevelId : undefined);
      handleClose();
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.message || "Failed to delete course level");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={level !== null}
      onClose={handleClose}
      title="Delete level?"
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
              <span className="font-semibold text-gray-800">{level?.name}</span> will be
              permanently deleted. This can't be undone.
            </p>
            {hasStudents && (
              <p className="mt-2">
                {level?.numberOfStudents} student{level?.numberOfStudents === 1 ? "" : "s"} currently
                assigned to this level. Choose where to move them.
              </p>
            )}
          </div>
        </div>

        {hasStudents && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reassign students to
            </label>
            <select
              value={reassignToLevelId}
              onChange={(e) => setReassignToLevelId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              <option value="">Select a level…</option>
              {otherLevels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        )}

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
            disabled={isSubmitting || (hasStudents && !reassignToLevelId)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Delete Level
          </button>
        </div>
      </div>
    </Modal>
  );
}
