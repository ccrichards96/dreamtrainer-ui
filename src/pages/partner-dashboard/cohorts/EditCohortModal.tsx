import React, { useState, useEffect } from "react";
import { Loader2, Save, AlertCircle } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import { updateCohort } from "../../../services/api/cohorts";
import { Cohort } from "../../../types/cohorts";
import { ApiError } from "../../../types/api";

interface EditCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohort: Cohort | null;
  onSuccess: () => void;
}

export default function EditCohortModal({
  isOpen,
  onClose,
  cohort,
  onSuccess,
}: EditCohortModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset the form to the cohort's current values whenever the modal opens.
  useEffect(() => {
    if (isOpen && cohort) {
      setName(cohort.name);
      setDescription(cohort.description ?? "");
      setError(null);
      setNameError(null);
    }
  }, [isOpen, cohort]);

  const handleSubmit = async () => {
    if (!cohort) return;

    setError(null);
    setNameError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Cohort name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateCohort(cohort.id, {
        name: trimmedName,
        description: description.trim() || null,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError((err as ApiError).message ?? "Failed to update cohort. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Cohort" size="md">
      <div className="p-6 space-y-6">
        {error && (
          <div className="flex gap-x-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-100">
            <AlertCircle className="size-5 flex-shrink-0 text-red-600" />
            <div>
              <h3 className="font-semibold">Error</h3>
              <p className="mt-1 text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Cohort Name */}
        <div>
          <label htmlFor="edit-cohort-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Cohort Name <span className="text-red-500">*</span>
          </label>
          <input
            id="edit-cohort-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="e.g. Summer 2026 Batch"
            className={`w-full py-3 px-4 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
              nameError
                ? "border-red-300 ring-2 ring-red-500/10 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200"
            }`}
            autoFocus
            disabled={isSubmitting}
          />
          {nameError && <p className="mt-1.5 text-xs font-medium text-red-600">{nameError}</p>}
        </div>

        {/* Course (read-only — course cannot be changed after creation) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Course</label>
          <div className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-600">
            {cohort?.course?.name ?? "—"}
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="edit-cohort-description"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Description
          </label>
          <textarea
            id="edit-cohort-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a brief description or schedule details for this cohort..."
            rows={4}
            className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            disabled={isSubmitting}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="py-2.5 px-4 inline-flex items-center gap-x-1.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="py-2.5 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
