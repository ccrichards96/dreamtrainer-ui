import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Check, X, Mail, Trash2, Loader2, MoreHorizontal, Users } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import {
  inviteSupportExperts,
  getSupportExpertInvites,
  deleteSupportExpertInvite,
  getCourseExperts,
  CourseInvite,
  CourseExpert,
} from "../../../services/api/course-invites";

export default function Expert() {
  const { id: courseId } = useParams<{ id: string }>();
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ success: boolean; message: string } | null>(
    null
  );

  // List state
  const [invites, setInvites] = useState<CourseInvite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Established experts state
  const [experts, setExperts] = useState<CourseExpert[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(true);

  const fetchInvites = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoadingInvites(true);
      const data = await getSupportExpertInvites(courseId);
      setInvites(data);
    } catch {
      setInvites([]);
    } finally {
      setLoadingInvites(false);
    }
  }, [courseId]);

  const fetchExperts = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoadingExperts(true);
      const data = await getCourseExperts(courseId);
      setExperts(data);
    } catch {
      setExperts([]);
    } finally {
      setLoadingExperts(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchInvites();
    fetchExperts();
  }, [fetchInvites, fetchExperts]);

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (email && isValidEmail(email) && !emails.includes(email)) {
      setEmails((prev) => [...prev, email]);
      setEmailInput("");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails((prev) => prev.filter((e) => e !== emailToRemove));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInvite = async () => {
    if (emails.length === 0 || !courseId) return;

    setIsInviting(true);
    try {
      const data = await inviteSupportExperts(courseId, emails);
      setInviteResult({
        success: true,
        message: `Successfully sent ${data.length} invitation${data.length > 1 ? "s" : ""}.`,
      });
      setEmails([]);
      await fetchInvites();
    } catch (err) {
      setInviteResult({
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to send invitations. Please try again.",
      });
    } finally {
      setIsInviting(false);
      setShowResultModal(true);
    }
  };

  const handleDelete = async (inviteId: string) => {
    if (!courseId) return;
    setDeletingId(inviteId);
    setOpenMenuId(null);
    try {
      await deleteSupportExpertInvite(courseId, inviteId);
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    } catch {
      // silently fail — could add toast
    } finally {
      setDeletingId(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <Check className="size-3" />
            Accepted
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite Expert Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Invite Experts</h3>
            <p className="mt-1 text-sm text-gray-500">
              Enter email addresses to invite experts who can contribute to your course.
            </p>
          </div>

          {/* Email Tag Input */}
          <div>
            <label htmlFor="email-input" className="block text-sm font-medium text-gray-900 mb-1.5">
              Email Addresses
            </label>
            <div className="min-h-[46px] flex flex-wrap items-center gap-2 p-2 rounded-lg border border-gray-300 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
              {emails.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-sm"
                >
                  <Mail className="size-3" />
                  {email}
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="ml-0.5 p-0.5 hover:bg-purple-200 rounded-full"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <input
                type="email"
                id="email-input"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleEmailKeyDown}
                onBlur={addEmail}
                placeholder={emails.length === 0 ? "Enter email and press Enter" : ""}
                className="flex-1 min-w-[200px] border-0 p-1 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              Press Enter or comma to add multiple emails
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleInvite}
              disabled={isInviting || emails.length === 0}
              className="py-2.5 px-5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInviting ? "Sending Invitations..." : "Invite Experts"}
            </button>
          </div>
        </div>
      </div>

      {/* Experts List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">Experts</h3>
          <p className="mt-1 text-sm text-gray-500">
            Current course experts and pending invitations.
          </p>
        </div>

        {/* Established Experts */}
        {loadingExperts ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-gray-400" />
          </div>
        ) : experts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {experts.map((expert) => (
                  <tr key={expert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {expert.expertProfile?.avatarUrl ? (
                          <img
                            src={expert.expertProfile.avatarUrl}
                            alt=""
                            className="size-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="size-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Users className="size-4 text-purple-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {expert.expertProfile?.displayName ??
                              (expert.expertProfile?.user
                                ? `${expert.expertProfile.user.firstName} ${expert.expertProfile.user.lastName}`
                                : "Unknown")}
                          </p>
                          {expert.expertProfile?.user?.email && (
                            <p className="text-xs text-gray-500">
                              {expert.expertProfile.user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">
                        {expert.role.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Check className="size-3" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* Pending Invites */}
        {loadingInvites ? (
          !loadingExperts && experts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-gray-400" />
            </div>
          ) : null
        ) : invites.length > 0 ? (
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              {experts.length === 0 && (
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
              )}
              <tbody className="bg-white divide-y divide-gray-200">
                {invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Mail className="size-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-900">{invite.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                        Support Expert
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(invite.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(openMenuId === invite.id ? null : invite.id)
                          }
                          disabled={deletingId === invite.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          {deletingId === invite.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="size-4" />
                          )}
                        </button>

                        {openMenuId === invite.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 z-20 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(invite.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="size-4" />
                                Remove
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* Empty state when both lists are empty */}
        {!loadingExperts && !loadingInvites && experts.length === 0 && invites.length === 0 && (
          <div className="text-center py-12">
            <Users className="size-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No experts or pending invitations yet.</p>
          </div>
        )}
      </div>

      {/* Result Modal */}
      <Modal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        title={inviteResult?.success ? "Success" : "Error"}
        size="sm"
      >
        <div className="text-center py-4">
          <div
            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              inviteResult?.success ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {inviteResult?.success ? (
              <Check className="size-6 text-green-600" />
            ) : (
              <X className="size-6 text-red-600" />
            )}
          </div>
          <p className="text-gray-600">{inviteResult?.message}</p>
          <button
            type="button"
            onClick={() => setShowResultModal(false)}
            className="mt-6 py-2.5 px-5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
