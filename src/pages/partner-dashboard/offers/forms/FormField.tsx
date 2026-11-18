import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}

/** Label + control wrapper used across the offer detail form. */
export default function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Shared input styling so all fields look consistent. */
export const fieldInputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400";
