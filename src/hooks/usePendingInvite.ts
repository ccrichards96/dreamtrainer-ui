import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { acceptSupportExpertInvite, acceptStakeholderInvite } from "../services/api/course-invites";

/**
 * Checks sessionStorage for a pending invite after auth redirect
 * and automatically accepts it, then redirects to the course.
 */
export default function usePendingInvite() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const raw = sessionStorage.getItem("pendingInvite");
    if (!raw) return;

    let invite: { token: string; course: string; role: string | null };
    try {
      invite = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem("pendingInvite");
      return;
    }

    const accept = async () => {
      try {
        if (invite.role === "support_expert") {
          await acceptSupportExpertInvite(invite.token);
        } else {
          await acceptStakeholderInvite(invite.token);
        }
        sessionStorage.removeItem("pendingInvite");
        navigate(`/courses/${invite.course}`, { replace: true });
      } catch (err) {
        console.error("Failed to accept pending invite:", err);
        sessionStorage.removeItem("pendingInvite");
      }
    };

    accept();
  }, [isAuthenticated, isLoading, navigate]);
}
