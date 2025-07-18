import React from 'react';

const SAMPLES = [
  { label: '🧠 Summarize user interviews' },
  { label: '📄 Draft a PRD' },
  { label: '🚨 Find UX friction points' },
  { label: '💡 Generate feature ideas' },
  { label: '📊 Analyze survey results' },
];

type PromptChipsProps = {
  onChipClick: (text: string) => void;
};

const PromptChips: React.FC<PromptChipsProps> = ({ onChipClick }) => (
  <div className="flex flex-wrap gap-2 mb-3 justify-center">
    {SAMPLES.map((chip) => (
      <button
        key={chip.label}
        type="button"
        onClick={() => onChipClick(chip.label)}
        className="px-4 py-2 rounded-full bg-teal-50/30 text-white font-medium shadow-sm border border-teal-100 hover:bg-teal-100/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        {chip.label}
      </button>
    ))}
  </div>
);

export default PromptChips;
