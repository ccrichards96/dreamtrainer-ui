import { Plus, X } from "lucide-react";
import { fieldInputClass } from "./FormField";

interface RequirementsListProps {
  requirements: string[];
  onChange: (requirements: string[]) => void;
}

export default function RequirementsList({ requirements, onChange }: RequirementsListProps) {
  const updateAt = (index: number, value: string) => {
    onChange(requirements.map((req, i) => (i === index ? value : req)));
  };

  const addRequirement = () => onChange([...requirements, ""]);

  const removeAt = (index: number) => {
    onChange(requirements.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 space-y-3">
        {requirements.map((requirement, index) => (
          <div key={index} className="group flex items-center gap-2">
            <input
              type="text"
              value={requirement}
              onChange={(e) => updateAt(index, e.target.value)}
              placeholder="-"
              className={fieldInputClass}
            />
            {requirements.length > 1 && (
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove requirement ${index + 1}`}
                className="text-gray-300 transition hover:text-red-500 group-hover:text-gray-400"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRequirement}
        aria-label="Add requirement"
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
