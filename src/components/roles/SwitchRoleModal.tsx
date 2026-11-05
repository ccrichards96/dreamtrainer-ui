import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Modal from "../modals/Modal";
import { useRole } from "../../contexts/useRoleContext";
import { DashboardRole } from "../../types/user";
import { toast } from "../toast";
import { roleConfig } from "./roleConfig";

interface SwitchRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SwitchRoleModal({ isOpen, onClose }: SwitchRoleModalProps) {
  const { activeRole, availableRoles, setActiveRole, goToRoleHome } = useRole();
  const [selectedRole, setSelectedRole] = useState<DashboardRole>(activeRole);

  // Reset the selection each time the modal opens
  useEffect(() => {
    if (isOpen) setSelectedRole(activeRole);
  }, [isOpen, activeRole]);

  const handleConfirm = () => {
    setActiveRole(selectedRole);
    onClose();
    goToRoleHome(selectedRole);
    toast.success(`Switched to ${roleConfig[selectedRole].label} view`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Switch role" size="sm">
      <div className="p-4 sm:p-6">
        <p className="text-sm text-gray-600">
          Choose which view you want to work in. Your dashboard will update to match.
        </p>

        <div className="mt-4 space-y-2" role="radiogroup" aria-label="Roles">
          {availableRoles.map((role) => {
            const { label, description, icon: Icon, badgeClass } = roleConfig[role];
            const isSelected = selectedRole === role;
            const isCurrent = activeRole === role;

            return (
              <button
                key={role}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedRole(role)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? "border-[#c5a8de] bg-purple-50 ring-1 ring-[#c5a8de]"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${badgeClass}`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{label}</span>
                    {isCurrent && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                        Current
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-gray-500">{description}</span>
                </span>
                {isSelected && <Check className="mt-1 size-4 shrink-0 text-[#9b7bbf]" />}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedRole === activeRole}
            className="rounded-lg bg-[#c5a8de] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b399d6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Switch to {roleConfig[selectedRole].label}
          </button>
        </div>
      </div>
    </Modal>
  );
}
