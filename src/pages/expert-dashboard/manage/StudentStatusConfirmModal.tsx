import { Award, Loader2, Undo2 } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import type { CourseStudentStatus } from "../../../types/enrollment";

interface StudentStatusConfirmModalProps {
  isOpen: boolean;
  /** Status the expert picked from the dropdown. */
  status: CourseStudentStatus | null;
  studentName: string;
  courseName?: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function StudentStatusConfirmModal({
  isOpen,
  status,
  studentName,
  courseName,
  isSubmitting,
  onConfirm,
  onCancel,
}: StudentStatusConfirmModalProps) {
  const isPassing = status === "passed";
  const course = courseName ? `“${courseName}”` : "this course";

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onCancel}
      title={isPassing ? "Mark student as passed?" : "Mark student as not passed?"}
      size="sm"
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="p-4 sm:p-6">
        <div className="flex gap-4">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
              isPassing ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
            }`}
          >
            {isPassing ? <Award className="size-5" /> : <Undo2 className="size-5" />}
          </span>

          <div className="text-sm text-gray-600">
            {isPassing ? (
              <>
                <p>
                  <span className="font-semibold text-gray-800">{studentName}</span> will be
                  registered as having passed {course}.
                </p>
                <p className="mt-2">
                  They'll receive a congratulations email. If {course} has active offers, the email
                  includes a <span className="font-medium text-gray-800">View Course Offers</span>{" "}
                  button linking to their offers page.
                </p>
              </>
            ) : (
              <p>
                <span className="font-semibold text-gray-800">{studentName}</span> will no longer be
                registered as having passed {course}. No email is sent for this change.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 ${
              isPassing ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isPassing ? "Confirm Pass" : "Confirm"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
