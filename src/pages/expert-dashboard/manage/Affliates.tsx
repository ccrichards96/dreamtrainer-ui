import { useState } from "react";
import { useParams } from "react-router-dom";
import { Copy, Check, X, Mail } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import { useExpertDashboardContext } from "../../../contexts";

export default function Affiliates() {
  const { id: courseId } = useParams<{ id: string }>();
  const { course, expertProfile } = useExpertDashboardContext();
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ success: boolean; message: string } | null>(
    null
  );

  // Generate referral link with expert slug (via) and course slug
  const referralLink = `${window.location.origin}/?via=${expertProfile?.slug ?? ""}&course=${course?.slug || courseId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
    if (emails.length === 0) return;

    setIsInviting(true);
    try {
      // TODO: API call to invite affiliates
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Inviting affiliates:", emails);

      setInviteResult({
        success: true,
        message: `Successfully sent invitations to ${emails.length} affiliate${emails.length > 1 ? "s" : ""}.`,
      });
      setEmails([]);
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

  return (
    <div className="space-y-6">
      {/* Refer Students Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Refer Students</h3>
            <p className="mt-1 text-sm text-gray-500">
              Any time a student uses this link, we will credit you with the sale.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-12 text-sm text-gray-600"
              />
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-x-2 py-2.5 px-4 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Invite Affiliates Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Invite Affiliates</h3>
            <p className="mt-1 text-sm text-gray-500">
              Enter email addresses to invite affiliates who can promote your course and earn
              commissions.
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
              {isInviting ? "Sending Invitations..." : "Invite Affiliates"}
            </button>
          </div>
        </div>
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
