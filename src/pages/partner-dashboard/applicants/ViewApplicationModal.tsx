import Modal from "../../../components/modals/Modal";
import { Applicant } from "./types";

interface ViewApplicationModalProps {
  applicant: Applicant | null;
  onClose: () => void;
}

export default function ViewApplicationModal({ applicant, onClose }: ViewApplicationModalProps) {
  return (
    <Modal
      isOpen={applicant !== null}
      onClose={onClose}
      title={applicant ? `${applicant.name}'s Application` : "Application"}
      size="lg"
    >
      <div className="p-6">
        <p className="text-sm text-gray-500">
          Application details will appear here. This is a placeholder for now.
        </p>
      </div>
    </Modal>
  );
}
