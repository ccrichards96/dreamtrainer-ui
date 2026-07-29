import React from "react";

/** Shared formatting + layout bits for the applicant detail modals. */

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

export function getInitials(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials || "?";
}

interface DetailProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}

/** Icon + label + value row used throughout the applicant modals. */
export function Detail({ icon: Icon, label, children }: DetailProps) {
  return (
    <div className="flex items-start gap-x-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
        <Icon className="size-4 text-gray-500" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <div className="mt-0.5 break-words text-sm font-semibold text-gray-800">{children}</div>
      </div>
    </div>
  );
}

/** Placeholder for a value the applicant/API hasn't supplied. */
export function Empty({ children }: { children: React.ReactNode }) {
  return <span className="font-normal text-gray-400">{children}</span>;
}
