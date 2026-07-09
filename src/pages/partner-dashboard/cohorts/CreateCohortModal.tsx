import React, { useState, useEffect } from "react";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import { Course } from "../shared/types";
import { createCohort } from "../../../services/api/cohorts";
import { CohortStatus } from "../../../types/cohorts";
import { ApiError } from "../../../types/api";

interface CreateCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  activeCourseId: string;
  onSuccess: () => void;
}

export default function CreateCohortModal({
  isOpen,
  onClose,
  courses,
  activeCourseId,
  onSuccess,
}: CreateCohortModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Set default course ID when modal opens or activeCourseId changes
  useEffect(() => {
    if (isOpen) {
      setCourseId(activeCourseId || (courses[0]?.id ?? ""));
      setName("");
      setDescription("");
      setError(null);
      setNameError(null);
    }
  }, [isOpen, activeCourseId, courses]);

  const handleSubmit = async () => {
    setError(null);
    setNameError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Cohort name is required.");
      return;
    }

    if (!courseId) {
      setError("Please select a course for this cohort.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCohort({
        name: trimmedName,
        courseId,
        description: description.trim() || null,
        status: "active",
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError((err as ApiError).message ?? "Failed to create cohort. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Cohort" size="md">
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
          <label htmlFor="cohort-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Cohort Name <span className="text-red-500">*</span>
          </label>
          <input
            id="cohort-name"
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
              nameError ? "border-red-300 ring-2 ring-red-500/10 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200"
            }`}
            autoFocus
            disabled={isSubmitting}
          />
          {nameError && <p className="mt-1.5 text-xs font-medium text-red-600">{nameError}</p>}
        </div>

        {/* Course Selection */}
        <div>
          <label htmlFor="cohort-course" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Select Course <span className="text-red-500">*</span>
          </label>
          <select
            id="cohort-course"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            disabled={isSubmitting}
          >
            <option value="" disabled>-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="cohort-description" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            id="cohort-description"
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
                Creating...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Create Cohort
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
