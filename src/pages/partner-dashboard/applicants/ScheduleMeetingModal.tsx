import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import { Applicant } from "./types";

interface ScheduleMeetingModalProps {
  applicant: Applicant | null;
  onClose: () => void;
  /** Called with an ISO datetime once the picked date/time passes validation. */
  onConfirm: (meetingAt: string) => void;
}

/** yyyy-mm-dd in the browser's local timezone, for the date input's value/min. */
function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** HH:mm in the browser's local timezone, for the time input's value. */
function toTimeInputValue(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function ScheduleMeetingModal({
  applicant,
  onClose,
  onConfirm,
}: ScheduleMeetingModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset (or prefill from an already-scheduled meeting) each time the modal opens.
  useEffect(() => {
    if (!applicant) return;
    const existing = applicant.meetingAt ? new Date(applicant.meetingAt) : null;
    setDate(existing ? toDateInputValue(existing) : "");
    setTime(existing ? toTimeInputValue(existing) : "");
    setError(null);
  }, [applicant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      setError("Select both a date and a time.");
      return;
    }

    const meetingDate = new Date(`${date}T${time}`);
    if (Number.isNaN(meetingDate.getTime())) {
      setError("That date and time aren't valid.");
      return;
    }
    if (meetingDate.getTime() <= Date.now()) {
      setError("Meeting time must be in the future.");
      return;
    }

    onConfirm(meetingDate.toISOString());
  };

  const today = toDateInputValue(new Date());
  const firstName = applicant?.name.split(" ")[0];

  return (
    <Modal
      isOpen={applicant !== null}
      onClose={onClose}
      title={applicant ? `Schedule Meeting with ${firstName}` : "Schedule Meeting"}
      size="sm"
    >
      {applicant && (
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="flex items-start gap-3 rounded-xl bg-purple-50 p-4 text-purple-700">
            <CalendarClock className="mt-0.5 size-5 shrink-0" />
            <p className="text-sm">
              Pick a date and time to meet with{" "}
              <span className="font-semibold">{applicant.name}</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="meeting-date" className="mb-1.5 block text-xs text-gray-500">
                Date
              </label>
              <input
                id="meeting-date"
                type="date"
                value={date}
                min={today}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label htmlFor="meeting-time" className="mb-1.5 block text-xs text-gray-500">
                Time
              </label>
              <input
                id="meeting-time"
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
