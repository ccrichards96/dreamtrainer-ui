import { useState } from "react";
import { Trash2 } from "lucide-react";
import WizardHeader from "./WizardHeader";
import { StepProps } from "./types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function TeamSetup({ data, updateData, onNext, onBack, currentStep }: StepProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
    if (data.teamInvites.some((invite) => invite.email.toLowerCase() === email.trim().toLowerCase())) {
      setError("That email has already been added");
      return;
    }

    updateData({
      teamInvites: [
        ...data.teamInvites,
        { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() },
      ],
    });
    setFirstName("");
    setLastName("");
    setEmail("");
    setError("");
  };

  const handleRemove = (emailToRemove: string) => {
    updateData({
      teamInvites: data.teamInvites.filter((invite) => invite.email !== emailToRemove),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <WizardHeader
        currentStep={currentStep}
        subtitle="Invite anyone who helps you source and manage candidates"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className="block text-sm text-gray-500 mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name..."
                className="py-2.5 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter first name..."
                className="py-2.5 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Teammate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Teammate Email"
                className="py-2.5 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="py-2.5 px-6 text-sm font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Add
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 underline mb-2">Users</h3>
            {data.teamInvites.length === 0 ? (
              <p className="text-sm text-gray-400">No teammates added yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {data.teamInvites.map((invite) => (
                  <li key={invite.email} className="flex items-center gap-2 text-sm text-gray-900">
                    <span className="font-bold">
                      {invite.firstName} {invite.lastName}
                    </span>
                    <span>- {invite.email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(invite.email)}
                      aria-label={`Remove ${invite.email}`}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-900 max-w-xs">
          Teammate invites aren&apos;t sent automatically yet — we&apos;ll follow up with next
          steps. Feel free to skip this step for now.
        </p>
      </div>

      <div className="pt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="py-2.5 px-6 text-sm font-semibold rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="py-2.5 px-6 text-sm font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
