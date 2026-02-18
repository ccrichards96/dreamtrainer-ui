import React, { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";
import { User, AdminUpdateUser, AdminUpdateExpertProfile, Role } from "../../types/user";
import { updateAdminUser } from "../../services/api/admin";
import Modal from "../modals/Modal";

type Tab = "user" | "expert";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("user");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: Role.User as Role,
    onboardingComplete: false,
    isEmailVerified: false,
  });
  const [expertData, setExpertData] = useState({
    displayName: "",
    bio: "",
    expertise: "",
    calendarLink: "",
    approvalStatus: "pending" as "pending" | "approved" | "rejected",
    listingStatus: "private" as "public" | "private",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasExpertProfile = !!user?.expertProfile;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        onboardingComplete: user.onboardingComplete,
        isEmailVerified: user.isEmailVerified,
      });
      if (user.expertProfile) {
        const ep = user.expertProfile;
        setExpertData({
          displayName: ep.displayName || "",
          bio: ep.bio || "",
          expertise: ep.expertise
            ? Object.values(ep.expertise).join(", ")
            : "",
          calendarLink: ep.calendarLink || "",
          approvalStatus: ep.approvalStatus || "pending",
          listingStatus: ep.listingStatus || "private",
        });
      }
      setActiveTab("user");
      setError(null);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field: "onboardingComplete" | "isEmailVerified") => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleExpertChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setExpertData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const updates: AdminUpdateUser = {};

      // User fields
      if (formData.firstName !== user.firstName) updates.firstName = formData.firstName;
      if (formData.lastName !== user.lastName) updates.lastName = formData.lastName;
      if (formData.email !== user.email) updates.email = formData.email;
      if (formData.role !== user.role) updates.role = formData.role;
      if (formData.onboardingComplete !== user.onboardingComplete)
        updates.onboardingComplete = formData.onboardingComplete;
      if (formData.isEmailVerified !== user.isEmailVerified)
        updates.isEmailVerified = formData.isEmailVerified;

      // Expert profile fields
      if (hasExpertProfile) {
        const ep = user.expertProfile!;
        const expertUpdates: AdminUpdateExpertProfile = {};
        let hasExpertChanges = false;

        if (expertData.displayName !== (ep.displayName || "")) {
          expertUpdates.displayName = expertData.displayName;
          hasExpertChanges = true;
        }
        if (expertData.bio !== (ep.bio || "")) {
          expertUpdates.bio = expertData.bio || null;
          hasExpertChanges = true;
        }
        const currentExpertise = ep.expertise ? Object.values(ep.expertise).join(", ") : "";
        if (expertData.expertise !== currentExpertise) {
          expertUpdates.expertise = expertData.expertise
            ? expertData.expertise.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
          hasExpertChanges = true;
        }
        if (expertData.calendarLink !== (ep.calendarLink || "")) {
          expertUpdates.calendarLink = expertData.calendarLink || null;
          hasExpertChanges = true;
        }
        if (expertData.approvalStatus !== ep.approvalStatus) {
          expertUpdates.approvalStatus = expertData.approvalStatus;
          hasExpertChanges = true;
        }
        if (expertData.listingStatus !== ep.listingStatus) {
          expertUpdates.listingStatus = expertData.listingStatus;
          hasExpertChanges = true;
        }

        if (hasExpertChanges) {
          updates.expertProfile = expertUpdates;
        }
      }

      if (Object.keys(updates).length === 0) {
        onClose();
        return;
      }

      await updateAdminUser(user.id, updates);
      onUserUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.firstName.trim().length > 0 &&
    formData.lastName.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    (!hasExpertProfile || expertData.displayName.trim().length > 0);

  if (!user) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "user", label: "User Details" },
    ...(hasExpertProfile ? [{ key: "expert" as Tab, label: "Expert Profile" }] : []),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="lg">
      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        {hasExpertProfile && (
          <div className="flex border-b border-gray-200 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* User Tab */}
          {activeTab === "user" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="detail-firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="detail-firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="detail-lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="detail-lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="detail-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="detail-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="detail-role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="detail-role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={Role.User}>User</option>
                  <option value={Role.Admin}>Admin</option>
                </select>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Status</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Onboarding Complete</p>
                    <p className="text-xs text-gray-500">Whether the user has completed onboarding</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("onboardingComplete")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.onboardingComplete ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.onboardingComplete ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Verified</p>
                    <p className="text-xs text-gray-500">Whether the user's email is verified</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("isEmailVerified")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isEmailVerified ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isEmailVerified ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>{" "}
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "\u2014"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Login:</span>{" "}
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "\u2014"}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Expert Profile Tab */}
          {activeTab === "expert" && hasExpertProfile && (
            <>
              <div>
                <label htmlFor="expert-displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  id="expert-displayName"
                  name="displayName"
                  value={expertData.displayName}
                  onChange={handleExpertChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="expert-bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="expert-bio"
                  name="bio"
                  value={expertData.bio}
                  onChange={handleExpertChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="A short biography..."
                />
              </div>

              <div>
                <label htmlFor="expert-expertise" className="block text-sm font-medium text-gray-700 mb-1">
                  Expertise
                </label>
                <input
                  type="text"
                  id="expert-expertise"
                  name="expertise"
                  value={expertData.expertise}
                  onChange={handleExpertChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., React, Node.js, TypeScript"
                />
                <p className="mt-1 text-xs text-gray-400">Comma-separated list</p>
              </div>

              <div>
                <label htmlFor="expert-calendarLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Calendar Link
                </label>
                <input
                  type="url"
                  id="expert-calendarLink"
                  name="calendarLink"
                  value={expertData.calendarLink}
                  onChange={handleExpertChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., https://calendly.com/..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expert-approvalStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Approval Status
                  </label>
                  <select
                    id="expert-approvalStatus"
                    name="approvalStatus"
                    value={expertData.approvalStatus}
                    onChange={handleExpertChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="expert-listingStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Listing Status
                  </label>
                  <select
                    id="expert-listingStatus"
                    name="listingStatus"
                    value={expertData.listingStatus}
                    onChange={handleExpertChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>

              {/* Expert Meta */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium text-gray-700">Slug:</span>{" "}
                    {user.expertProfile?.slug || "\u2014"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Approved At:</span>{" "}
                    {user.expertProfile?.approvedAt
                      ? new Date(user.expertProfile.approvedAt).toLocaleDateString()
                      : "\u2014"}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UserDetailModal;
