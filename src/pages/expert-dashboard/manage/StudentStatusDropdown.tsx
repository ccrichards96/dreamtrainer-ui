import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, CircleDashed, Loader2 } from "lucide-react";
import type { CourseStudentStatus } from "../../../types/enrollment";

interface StudentStatusDropdownProps {
  status: CourseStudentStatus;
  /** Label used for the trigger's accessible name, e.g. the student's full name. */
  studentName: string;
  isBusy?: boolean;
  onSelect: (status: CourseStudentStatus) => void;
}

const options: { value: CourseStudentStatus; label: string }[] = [
  { value: "passed", label: "Passed" },
  { value: "not_passed", label: "Not Passed" },
];

const triggerStyles: Record<CourseStudentStatus, string> = {
  passed: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
  not_passed: "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100",
};

export default function StudentStatusDropdown({
  status,
  studentName,
  isBusy = false,
  onSelect,
}: StudentStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (value: CourseStudentStatus) => {
    setOpen(false);
    if (value !== status) onSelect(value);
  };

  const current = options.find((option) => option.value === status) ?? options[1];
  const StatusIcon = status === "passed" ? Check : CircleDashed;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={`Change pass status for ${studentName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={isBusy}
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${triggerStyles[status]}`}
      >
        {isBusy ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <StatusIcon className="size-3.5" />
        )}
        {current.label}
        <ChevronDown className="size-3.5 opacity-60" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={option.value === status}
              onClick={() => handleSelect(option.value)}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
            >
              {option.label}
              {option.value === status && <Check className="size-4 shrink-0 text-purple-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
