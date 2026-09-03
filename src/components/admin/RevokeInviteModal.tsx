import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "../modals/Modal";
import { deletePartnerInvite, CourseInvite } from "../../services/api/course-invites";
import { toast } from "../toast";

interface RevokeInviteModalProps {
  courseId: string;
  invite: CourseInvite | null;
  onClose: () => void;
  onRevoked: (inviteId: string) => void;
}

export default function RevokeInviteModal({
  courseId,
  invite,
  onClose,
  onRevoked,
}: RevokeInviteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (!invite) return;

    setIsSubmitting(true);
    try {
      await deletePartnerInvite(courseId, invite.id);
      onRevoked(invite.id);
      onClose();
      toast.success("Invitation revoked", { description: invite.email });
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={invite !== null}
      onClose={handleClose}
      title="Revoke invitation?"
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
              The invitation for <span className="font-semibold text-gray-800">{invite?.email}</span>{" "}
              will be revoked. They won&apos;t be able to use this invite link to join anymore.
            </p>
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
            Revoke Invitation
          </button>
        </div>
      </div>
    </Modal>
  );
}
