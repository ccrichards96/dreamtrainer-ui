import { Plus, X } from "lucide-react";
import { fieldInputClass } from "./FormField";

interface DynamicListFieldProps {
  values: string[];
  onChange: (values: string[]) => void;
  /** Singular noun used for the add/remove aria labels, e.g. "requirement". */
  itemLabel: string;
  placeholder?: string;
}

/** A repeatable single-line input: rows can be added and removed one at a time. */
export default function DynamicListField({
  values,
  onChange,
  itemLabel,
  placeholder = "-",
}: DynamicListFieldProps) {
  const updateAt = (index: number, value: string) => {
    onChange(values.map((item, i) => (i === index ? value : item)));
  };

  const addItem = () => onChange([...values, ""]);

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 space-y-3">
        {values.map((value, index) => (
          <div key={index} className="group flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => updateAt(index, e.target.value)}
              placeholder={placeholder}
              className={fieldInputClass}
            />
            {values.length > 1 && (
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${itemLabel} ${index + 1}`}
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
        onClick={addItem}
        aria-label={`Add ${itemLabel}`}
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
