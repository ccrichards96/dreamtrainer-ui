import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Send,
  Save,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useExpertDashboardContext } from "../../../contexts";
import {
  createCourseAnnouncement,
  listCourseAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../../services/api/announcements";
import { Announcement, CreateCourseAnnouncementPayload } from "../../../types/announcements";
import ManagePageHeader from "./ManagePageHeader";
import Modal from "../../../components/modals/Modal";
import { sanitizeHtml, getPlainTextLength } from "../../../utils/htmlSanitizer";

const emptyForm: CreateCourseAnnouncementPayload = {
  name: "",
  message: "",
  type: "general",
  priority: "normal",
};

export default function CourseAnnouncements() {
  const { id: courseId } = useParams<{ id: string }>();
  const { updateAnnouncements } = useExpertDashboardContext();

  // List state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateCourseAnnouncementPayload>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isEditing = editingAnnouncement !== null;

  const fetchAnnouncements = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await listCourseAnnouncements(courseId, { page, limit: 20, sort: "desc" });
      setAnnouncements(result.data);
      setMeta(result.meta);
      updateAnnouncements(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load announcements");
    } finally {
      setIsLoading(false);
    }
  }, [courseId, page, updateAnnouncements]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setFormData(emptyForm);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      name: announcement.name,
      message: announcement.message,
      type: announcement.type,
      priority: announcement.priority,
    });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAnnouncement(null);
    setFormData(emptyForm);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    if (!formData.name.trim() || getPlainTextLength(formData.message) === 0) {
      setFormError("Name and message are required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      const payload = { ...formData, message: sanitizeHtml(formData.message) };
      if (isEditing) {
        await updateAnnouncement(editingAnnouncement.id, payload);
      } else {
        await createCourseAnnouncement(courseId, payload);
        setPage(1);
      }
      closeModal();
      await fetchAnnouncements();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : `Failed to ${isEditing ? "update" : "create"} announcement`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (announcementId: string) => {
    if (!courseId) return;
    setDeletingId(announcementId);
    try {
      await deleteAnnouncement(announcementId);
      await fetchAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete announcement");
    } finally {
      setDeletingId(null);
    }
  };

  const priorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      normal: "bg-gray-100 text-gray-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
      low: "bg-blue-100 text-blue-700",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[priority] || styles.normal}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const typeBadge = (type: string) => {
    const styles: Record<string, string> = {
      general: "bg-purple-100 text-purple-700",
      update: "bg-green-100 text-green-700",
      alert: "bg-yellow-100 text-yellow-700",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[type] || styles.general}`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <ManagePageHeader
        title="Announcements"
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-x-1.5 py-2.5 px-4 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
          >
            <Plus className="size-4" />
            New Announcement
          </button>
        }
      />

      {/* Announcements List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {isLoading ? (
          <div className="p-6 text-center text-sm text-gray-500">Loading announcements...</div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-red-600 text-sm">
              <AlertCircle className="size-4" />
              {error}
            </div>
            <button
              type="button"
              onClick={fetchAnnouncements}
              className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Try again
            </button>
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No announcements yet. Create one to get started.
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {announcement.name}
                        </h4>
                        {typeBadge(announcement.type)}
                        {priorityBadge(announcement.priority)}
                      </div>
                      <div
                        className="text-sm text-gray-600 [&>p]:mb-1 [&>ul]:ml-4 [&>ol]:ml-4 [&>li]:mb-0.5 [&>strong]:font-semibold [&>em]:italic [&>u]:underline [&>a]:text-purple-600 [&>a]:underline"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(announcement.message) }}
                      />
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditModal(announcement)}
                        className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(announcement.id)}
                        disabled={deletingId === announcement.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
                <p className="text-xs text-gray-500">
                  Page {meta.page} of {meta.totalPages} ({meta.total} total)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page >= meta.totalPages}
                    className="p-1.5 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={isEditing ? "Edit Announcement" : "Create Announcement"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertCircle className="size-4 shrink-0" />
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="ann-name" className="block text-sm font-medium text-gray-900 mb-1.5">
              Announcement Title *
            </label>
            <input
              id="ann-name"
              type="text"
              maxLength={255}
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Welcome to Module 3"
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="ann-type" className="block text-sm font-medium text-gray-900 mb-1.5">
                Type *
              </label>
              <select
                id="ann-type"
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value as Announcement["type"] }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="general">General</option>
                <option value="account">Account</option>
                <option value="support">Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="ann-priority"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Priority *
              </label>
              <select
                id="ann-priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value as Announcement["priority"],
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Message *
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.message}
                onChange={(content) => setFormData((prev) => ({ ...prev, message: content }))}
                placeholder="Write your announcement message..."
                style={{ minHeight: "150px", backgroundColor: "white" }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-x-1.5 py-2.5 px-5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? <Save className="size-4" /> : <Send className="size-4" />}
              {isSubmitting
                ? isEditing
                  ? "Saving..."
                  : "Sending..."
                : isEditing
                  ? "Save Changes"
                  : "Send Announcement"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="py-2.5 px-5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
