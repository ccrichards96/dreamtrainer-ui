import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  User,
  FileText,
  CalendarPlus,
  Send,
  XCircle,
  LucideIcon,
} from "lucide-react";
import { Applicant, ApplicantAction } from "./types";

interface ApplicantActionsMenuProps {
  applicant: Applicant;
  onAction: (action: ApplicantAction, applicant: Applicant) => void;
}

interface MenuItem {
  action: ApplicantAction;
  label: string;
  icon: LucideIcon;
  /** Visually separated, destructive styling */
  destructive?: boolean;
}

export default function ApplicantActionsMenu({ applicant, onAction }: ApplicantActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const firstName = applicant.name.split(" ")[0];

  const items: MenuItem[] = [
    { action: "view_profile", label: "View Profile", icon: User },
    { action: "view_application", label: "View Application", icon: FileText },
    { action: "schedule_meeting", label: "Schedule Meeting", icon: CalendarPlus },
    { action: "submit_offer", label: `Submit Offer to ${firstName}`, icon: Send },
    {
      action: "move_to_not_selected",
      label: "Move to Not Selected",
      icon: XCircle,
      destructive: true,
    },
  ];

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleSelect = (action: ApplicantAction) => {
    setOpen(false);
    onAction(action, applicant);
  };

  return (
    <div ref={containerRef} className="relative justify-self-end">
      <button
        type="button"
        aria-label={`Actions for ${applicant.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        <MoreVertical className="size-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.action}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(item.action)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition ${
                  item.destructive
                    ? "border-t border-gray-100 text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
