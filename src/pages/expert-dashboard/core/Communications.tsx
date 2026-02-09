import { useState } from "react";

type CommunicationsTab = "messages";

const communicationsTabs: { id: CommunicationsTab; label: string }[] = [
  { id: "messages", label: "Messages" },
];

export default function Communications() {
  const [activeSubTab, setActiveSubTab] = useState<CommunicationsTab>("messages");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Communications</h1>

      {/* Sub-tab navigation */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Communications tabs">
          {communicationsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition
                ${activeSubTab === tab.id
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sub-tab content */}
      <div className="mt-6">
        {activeSubTab === "messages" && (
          <div>
            <p className="text-gray-600">Your messages and conversations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
