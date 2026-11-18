import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Layers, Loader2 } from "lucide-react";
import type { CourseLevel } from "../../../types/modules";

interface StudentLevelDropdownProps {
  levels: CourseLevel[];
  levelId: string | null;
  studentName: string;
  isBusy?: boolean;
  onSelect: (levelId: string | null) => void;
}

export default function StudentLevelDropdown({
  levels,
  levelId,
  studentName,
  isBusy = false,
  onSelect,
}: StudentLevelDropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click (either the trigger or the portaled menu) or Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
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

  // Position the portaled menu against the trigger, and keep it in sync on
  // scroll/resize so it tracks the button even inside a scrollable table.
  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const handleSelect = (value: string | null) => {
    setOpen(false);
    if (value !== levelId) onSelect(value);
  };

  const current = levels.find((level) => level.id === levelId);
  const currentLabel = current?.name ?? "Unassigned";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={`Change level for ${studentName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={isBusy}
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
          current
            ? "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
            : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
        }`}
      >
        {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Layers className="size-3.5" />}
        {currentLabel}
        <ChevronDown className="size-3.5 opacity-60" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: menuPos.top, left: menuPos.left, minWidth: menuPos.width }}
            className="fixed z-50 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg max-h-64 overflow-y-auto"
          >
            <button
              type="button"
              role="menuitemradio"
              aria-checked={levelId === null}
              onClick={() => handleSelect(null)}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
            >
              Unassigned
              {levelId === null && <Check className="size-4 shrink-0 text-purple-600" />}
            </button>
            {levels.map((level) => (
              <button
                key={level.id}
                type="button"
                role="menuitemradio"
                aria-checked={level.id === levelId}
                onClick={() => handleSelect(level.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
              >
                {level.name}
                {level.id === levelId && <Check className="size-4 shrink-0 text-purple-600" />}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
