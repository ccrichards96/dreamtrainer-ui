import React, { useState } from "react";
import { AlertCircle, Loader2, Send } from "lucide-react";
import Modal from "../modals/Modal";
import { PartnerCourseRole, PartnerPrefillData } from "../../types/partner";
import { invitePartners, CourseInvite } from "../../services/api/course-invites";

interface InvitePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onInvited: (invite: CourseInvite) => void;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const InvitePartnerModal: React.FC<InvitePartnerModalProps> = ({
  isOpen,
  onClose,
  courseId,
  onInvited,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<PartnerCourseRole>("partner");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [title, setTitle] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [calendarLink, setCalendarLink] = useState("");
  const [bio, setBio] = useState("");
  const [orgBio, setOrgBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEmail("");
    setRole("partner");
    setFirstName("");
    setLastName("");
    setOrgName("");
    setTitle("");
    setWebsiteUrl("");
    setCalendarLink("");
    setBio("");
    setOrgBio("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      setError("Enter a valid email address");
      return;
    }

    const prefillData: PartnerPrefillData = {
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      orgName: orgName.trim() || undefined,
      title: title.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      calendarLink: calendarLink.trim() || undefined,
      bio: bio.trim() || undefined,
      orgBio: orgBio.trim() || undefined,
    };

    setIsSubmitting(true);
    setError(null);
    try {
      const invite = await invitePartners(courseId, normalizedEmail, role, prefillData);
      onInvited(invite);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to send partner invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full py-2.5 px-3.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Partner" size="lg">
      <div className="p-6 space-y-5">
        {error && (
          <div className="flex gap-x-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-100">
            <AlertCircle className="size-5 flex-shrink-0 text-red-600" />
            <p>{error}</p>
          </div>
        )}

        <p className="text-sm text-gray-500">
          Prefill what you already know about this partner. They&apos;ll be able to review and
          confirm these details during onboarding instead of entering them from scratch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="invite-email" className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="partner@example.com"
              className={inputClass}
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="invite-role" className={labelClass}>
              Role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as PartnerCourseRole)}
              className={inputClass}
              disabled={isSubmitting}
            >
              <option value="owner">Owner (Full Access)</option>
              <option value="partner">Partner</option>
            </select>
          </div>

          <div>
            <label htmlFor="invite-firstName" className={labelClass}>
              First Name
            </label>
            <input
              id="invite-firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="invite-lastName" className={labelClass}>
              Last Name
            </label>
            <input
              id="invite-lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="invite-orgName" className={labelClass}>
              Organization Name
            </label>
            <input
              id="invite-orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="invite-title" className={labelClass}>
              Title
            </label>
            <input
              id="invite-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Program Director"
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="invite-websiteUrl" className={labelClass}>
              Website URL
            </label>
            <input
              id="invite-websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://"
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="invite-calendarLink" className={labelClass}>
              Calendar Link
            </label>
            <input
              id="invite-calendarLink"
              type="url"
              value={calendarLink}
              onChange={(e) => setCalendarLink(e.target.value)}
              placeholder="https://"
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="invite-bio" className={labelClass}>
              Bio
            </label>
            <textarea
              id="invite-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="invite-orgBio" className={labelClass}>
              Organization Bio
            </label>
            <textarea
              id="invite-orgBio"
              value={orgBio}
              onChange={(e) => setOrgBio(e.target.value)}
              rows={3}
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="py-2.5 px-4 text-sm font-medium rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !email.trim()}
            className="py-2.5 px-5 text-sm font-medium rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Send Invitation
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InvitePartnerModal;
