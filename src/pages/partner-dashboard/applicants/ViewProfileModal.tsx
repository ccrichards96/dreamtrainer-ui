import Modal from "../../../components/modals/Modal";
import { Applicant } from "./types";

interface ViewProfileModalProps {
  applicant: Applicant | null;
  onClose: () => void;
}

export default function ViewProfileModal({ applicant, onClose }: ViewProfileModalProps) {
  return (
    <Modal
      isOpen={applicant !== null}
      onClose={onClose}
      title={applicant ? `${applicant.name}'s Profile` : "Profile"}
      size="lg"
    >
      <div className="p-6">
        <p className="text-sm text-gray-500">
          Profile details will appear here. This is a placeholder for now.
        </p>
      </div>
    </Modal>
  );
}
