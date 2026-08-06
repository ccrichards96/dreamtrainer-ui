import { useEffect, useState } from "react";
import { Loader2, Mail, UserX } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import { listCohortMembers, removeCohortMember } from "../../../services/api/cohorts";
import { Cohort, CohortMember } from "../../../types/cohorts";
import { ApiError } from "../../../types/api";
import { toast } from "../../../components/toast";

interface ManageMembersModalProps {
  cohort: Cohort | null;
  onClose: () => void;
  /** Called after a member is successfully removed, so the caller can refresh member counts. */
  onMemberRemoved?: () => void;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString("en-US");
}

function getInitials(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials || "?";
}

export default function ManageMembersModal({
  cohort,
  onClose,
  onMemberRemoved,
}: ManageMembersModalProps) {
  const [members, setMembers] = useState<CohortMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!cohort) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    listCohortMembers(cohort.id)
      .then((data) => {
        if (cancelled) return;
        // Soft-removed members are just history — don't show them as current members.
        setMembers(data.filter((member) => member.status !== "removed"));
      })
      .catch((err) => {
        if (cancelled) return;
        setError((err as ApiError).message || "Failed to load members");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cohort]);

  const handleRemove = async (member: CohortMember) => {
    if (!cohort) return;

    setRemovingUserId(member.userId);
    try {
      await removeCohortMember(cohort.id, member.userId);
      setMembers((prev) => prev.filter((m) => m.userId !== member.userId));
      toast.success("Member removed");
      onMemberRemoved?.();
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to remove member");
    } finally {
      setRemovingUserId(null);
    }
  };

  return (
    <Modal
      isOpen={cohort !== null}
      onClose={onClose}
      title={cohort ? `Members — ${cohort.name}` : "Members"}
      size="md"
    >
      <div className="p-6">
        {isLoading ? (
          <div className="flex min-h-[160px] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="flex min-h-[160px] items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : members.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center">
            <p className="text-sm text-gray-500">No members in this cohort yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {members.map((member) => {
              const name = member.user
                ? `${member.user.firstName ?? ""} ${member.user.lastName ?? ""}`.trim() ||
                  member.user.email
                : "Unknown user";

              return (
                <li key={member.id} className="flex items-center gap-3 py-3">
                  {member.user?.avatarUrl ? (
                    <img
                      src={member.user.avatarUrl}
                      alt=""
                      className="size-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-purple-100">
                      <span className="text-sm font-semibold text-purple-700">
                        {getInitials(name)}
                      </span>
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">{name}</p>
                    {member.user?.email && (
                      <p className="flex items-center gap-1 truncate text-xs text-gray-500">
                        <Mail className="size-3 shrink-0" />
                        {member.user.email}
                      </p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      member.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {member.status}
                  </span>

                  <span className="hidden shrink-0 text-xs text-gray-400 sm:block">
                    {formatDate(member.addedAt)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemove(member)}
                    disabled={removingUserId === member.userId}
                    aria-label={`Remove ${name} from ${cohort?.name ?? "cohort"}`}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    {removingUserId === member.userId ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <UserX className="size-4" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 inline-flex items-center gap-x-1.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
