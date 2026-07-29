import { useEffect, useState } from "react";
import Modal from "../../components/modals/Modal";
import type { StudentOffer } from "./types";
import { toast } from "../../components/toast";
import { Check, FileText, Loader2, Paperclip, Upload, X } from "lucide-react";

// Mirrors the limits enforced by the attachments upload middleware on the API.
const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface ApplicationSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: StudentOffer | null;
  isSubmitting: boolean;
  onSubmit: (files: File[]) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

export default function ApplicationSubmissionModal({
  isOpen,
  onClose,
  offer,
  isSubmitting,
  onSubmit,
}: ApplicationSubmissionModalProps) {
  const [files, setFiles] = useState<File[]>([]);

  // The modal stays mounted between openings, so clear the previous selection
  // rather than carrying one offer's documents over to the next.
  useEffect(() => {
    if (!isOpen) setFiles([]);
  }, [isOpen]);

  if (!offer) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    e.target.value = "";
    if (!selected || selected.length === 0) return;

    const picked = Array.from(selected);
    const oversized = picked.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      toast.error("File too large", {
        description: `${oversized[0].name} is over the ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
      });
    }

    const accepted = picked.filter((file) => file.size <= MAX_FILE_SIZE);
    setFiles((prev) => {
      const room = MAX_FILES - prev.length;
      if (accepted.length > room) {
        toast.error(`You can attach at most ${MAX_FILES} documents`);
      }
      return [...prev, ...accepted.slice(0, Math.max(0, room))];
    });
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setFiles([]);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(files);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Submit Application" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="p-6 space-y-6">
          {/* Offer summary */}
          <div>
            {offer.partnerName && (
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                {offer.partnerName}
              </p>
            )}
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">{offer.title}</h3>
          </div>

          {/* Requirements */}
          {offer.requirements && offer.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                Requirements
              </h4>
              <ul className="space-y-2.5">
                {offer.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-x-3 text-gray-700 text-sm sm:text-base"
                  >
                    <div className="flex size-5 items-center justify-center rounded-full bg-purple-100 text-purple-600 mt-0.5 flex-shrink-0">
                      <Check className="size-3" />
                    </div>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Document upload */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
              Supporting Documents
            </label>

            {files.length > 0 && (
              <ul className="mb-3 space-y-2">
                {files.map((file, idx) => (
                  <li
                    key={`${file.name}-${idx}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-300 bg-gray-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="size-5 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-900 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 shrink-0">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      disabled={isSubmitting}
                      className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <label
              htmlFor="application-documents"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-colors"
            >
              <Upload className="size-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to select files</p>
              <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
            </label>
            <input
              id="application-documents"
              type="file"
              multiple
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="hidden"
            />

            <p className="mt-2 flex items-center gap-x-1.5 text-xs text-gray-500">
              <Paperclip className="size-3.5" />
              Attach any files referenced in the requirements above (resume, portfolio, etc.)
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-x-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Submit Application
          </button>
        </div>
      </form>
    </Modal>
  );
}
