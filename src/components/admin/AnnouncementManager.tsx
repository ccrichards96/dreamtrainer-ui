import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  AlertCircle,
  Megaphone,
  Clock,
  AlertTriangle,
  Info,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Announcement } from "../../types/announcements";
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../services/api/announcements";
import { sanitizeHtml, getPlainTextLength } from "../../utils/htmlSanitizer";

interface AnnouncementFormData {
  name: string;
  message: string;
  type: "general" | "account" | "support" | "other";
  priority: "low" | "normal" | "high";
}

const AnnouncementManager: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AnnouncementFormData>({
    name: "",
    message: "",
    type: "general",
    priority: "normal",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      message: "",
      type: "general",
      priority: "normal",
    });
  };

  // Load announcements on component mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setInitialLoading(true);
        const announcementData = await getAllAnnouncements();
        setAnnouncements(announcementData || []);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuillChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      message: content,
    }));
  };

  const handleAddAnnouncement = () => {
    setShowAddForm(true);
    setEditingAnnouncement(null);
    resetForm();
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowAddForm(true);
    setFormData({
      name: announcement.name,
      message: announcement.message,
      type: announcement.type,
      priority: announcement.priority,
    });
  };

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sanitizedFormData = {
        ...formData,
        message: sanitizeHtml(formData.message),
      };

      if (editingAnnouncement) {
        // Update existing announcement via API
        const updatedAnnouncement = await updateAnnouncement(
          editingAnnouncement.id,
          sanitizedFormData
        );

        // Update local state
        setAnnouncements((prev) =>
          prev.map((announcement) =>
            announcement.id === editingAnnouncement.id ? updatedAnnouncement : announcement
          )
        );
      } else {
        // Create new announcement via API
        const newAnnouncement = await createAnnouncement(sanitizedFormData);

        // Add to local state
        setAnnouncements((prev) => [newAnnouncement, ...prev]);
      }

      setShowAddForm(false);
      setEditingAnnouncement(null);
      resetForm();
    } catch (err) {
      setError("Failed to save announcement. Please try again.");
      console.error("Error saving announcement:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      // Delete announcement via API
      await deleteAnnouncement(announcementId);

      // Remove from local state
      setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== announcementId));
    } catch (err) {
      setError("Failed to delete announcement. Please try again.");
      console.error("Error deleting announcement:", err);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAnnouncement(null);
    resetForm();
  };

  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.message.trim().length > 0 &&
    getPlainTextLength(formData.message) > 0; // Check if there's actual content beyond HTML tags

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "general":
        return <Info className="w-4 h-4" />;
      case "account":
        return <Clock className="w-4 h-4" />;
      case "support":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Megaphone className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "general":
        return "bg-blue-100 text-blue-800";
      case "account":
        return "bg-green-100 text-green-800";
      case "support":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Manage Announcements</h3>
              <p className="text-sm text-gray-500">
                Create and manage system announcements for users
              </p>
            </div>
            <button
              onClick={handleAddAnnouncement}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Announcement
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Total Announcements: {announcements.length}
              </p>
              <p className="text-sm text-gray-500">Active announcements visible to users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Add/Edit Announcement Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">
                {editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}
              </h4>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitAnnouncement} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Announcement Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., System Maintenance Notice"
                />
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="account">Account</option>
                  <option value="support">Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.message}
                    onChange={handleQuillChange}
                    placeholder="Enter the announcement message that will be displayed to users..."
                    style={{
                      minHeight: "150px",
                      backgroundColor: "white",
                    }}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ color: [] }, { background: [] }],
                        ["link"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "list",
                      "bullet",
                      "color",
                      "background",
                      "link",
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingAnnouncement ? "Update Announcement" : "Add Announcement"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Announcements List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">
            Announcements ({announcements.length})
          </h4>
        </div>

        {announcements.length === 0 ? (
          <div className="p-8 text-center">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No announcements found. Add your first announcement to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="text-lg font-medium text-gray-900">{announcement.name}</h5>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getTypeColor(announcement.type)}`}
                      >
                        {getTypeIcon(announcement.type)}
                        {announcement.type}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}
                      >
                        {announcement.priority} priority
                      </span>
                    </div>
                    <div
                      className="text-gray-600 mb-3 prose prose-sm max-w-none [&>*]:mb-2 [&>h1]:text-lg [&>h2]:text-base [&>h3]:text-sm [&>p]:text-sm [&>ul]:text-sm [&>ol]:text-sm [&>strong]:font-semibold [&>em]:italic [&>u]:underline"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(announcement.message) }}
                    />
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(announcement.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit announcement"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnnouncementManager;
