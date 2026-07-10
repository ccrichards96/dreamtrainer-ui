import { useState, useEffect } from "react";
import Modal from "./modals/Modal";
import { sanitizeHtml } from "../utils/htmlSanitizer";

interface CourseAgreementModalProps {
  isOpen: boolean;
  agreementHtml: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CourseAgreementModal({
  isOpen,
  agreementHtml,
  onConfirm,
  onClose,
}: CourseAgreementModalProps) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isOpen) setChecked(false);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Course Agreement" size="md">
      <div className="p-4 sm:p-6 space-y-4">
        <div
          className="text-gray-700 text-sm max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 [&>h1]:font-semibold [&>h1]:text-base [&>h1]:text-gray-900 [&>h1]:mt-2 [&>h1]:mb-1 [&>h2]:font-semibold [&>h2]:text-sm [&>h2]:text-gray-900 [&>h2]:mt-2 [&>h2]:mb-1 [&>h3]:font-semibold [&>h3]:text-sm [&>h3]:text-gray-900 [&>h3]:mt-2 [&>h3]:mb-1 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ul]:ml-4 [&>ol]:mb-2 [&>ol]:ml-4 [&>li]:mb-1 [&>strong]:font-semibold [&>em]:italic [&>u]:underline [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(agreementHtml) }}
        />

        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700">I have read and agree to the terms above</span>
        </label>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!checked}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}
