import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import {
  acceptSupportExpertInvite,
  acceptStakeholderInvite,
} from "../../services/api/course-invites";

type InviteStatus = "loading" | "success" | "error";

export default function InviteAccept() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [status, setStatus] = useState<InviteStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const token = searchParams.get("token");
  const course = searchParams.get("course");
  const role = searchParams.get("role");

  useEffect(() => {
    if (!token || !course) {
      setStatus("error");
      setErrorMessage("Invalid invite link. Missing required parameters.");
      return;
    }

    // Store invite details for post-auth pickup
    sessionStorage.setItem(
      "pendingInvite",
      JSON.stringify({ token, course, role })
    );

    if (isLoading) return;

    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname + window.location.search },
      });
      return;
    }

    acceptInvite(token, role, course);
  }, [isAuthenticated, isLoading, token, course, role]);

  const acceptInvite = async (
    inviteToken: string,
    inviteRole: string | null,
    courseSlug: string
  ) => {
    setStatus("loading");
    try {
      if (inviteRole === "support_expert") {
        await acceptSupportExpertInvite(inviteToken);
      } else {
        await acceptStakeholderInvite(inviteToken);
      }

      sessionStorage.removeItem("pendingInvite");
      setStatus("success");

      setTimeout(() => {
        navigate(`/courses/${courseSlug}`, { replace: true });
      }, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "This invitation has expired or was already used."
      );
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#c5a8de]" />
          <span className="text-lg text-gray-600">Accepting invitation...</span>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invitation Accepted</h2>
          <p className="text-gray-600">Redirecting you to the course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Accept Invitation</h2>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        <button
          onClick={() => navigate("/", { replace: true })}
          className="bg-[#c5a8de] text-white px-6 py-2 rounded-lg hover:bg-[#b399d6] transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
