import React from "react";
import { UserCog } from "lucide-react";
import { useImpersonationContext } from "../../contexts/useImpersonationContext";

const ImpersonationBanner: React.FC = () => {
  const { impersonation, returnToAdmin } = useImpersonationContext();

  if (!impersonation) return null;

  const { user } = impersonation;

  return (
    <div className="sticky top-16 z-40 flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-medium text-amber-950">
      <UserCog className="h-4 w-4 flex-shrink-0" />
      <span>
        Viewing as {user.firstName} {user.lastName} ({user.email})
      </span>
      <button
        type="button"
        onClick={returnToAdmin}
        className="ml-2 rounded-md bg-amber-950 px-3 py-1 text-xs font-semibold text-amber-50 hover:bg-amber-900"
      >
        Return to Admin
      </button>
    </div>
  );
};

export default ImpersonationBanner;
