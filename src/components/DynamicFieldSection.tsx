import { Plus, Trash2 } from "lucide-react";

export interface DynamicFieldSectionProps {
  title: string;
  description?: string;
  value: string[];
  onChange: (fields: string[]) => void;
  placeholder?: string;
  minFields?: number;
}

export default function DynamicFieldSection({
  title,
  description,
  value,
  onChange,
  placeholder = "Enter text...",
  minFields = 1,
}: DynamicFieldSectionProps) {
  const handleAddField = () => {
    onChange([...value, ""]);
  };

  const handleRemoveField = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChangeField = (index: number, newValue: string) => {
    onChange(value.map((item, i) => (i === index ? newValue : item)));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>

      <div className="space-y-3">
        {value.map((field, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="text"
              value={field}
              onChange={(e) => handleChangeField(index, e.target.value)}
              placeholder={placeholder}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
            />
            {value.length > minFields && (
              <button
                type="button"
                onClick={() => handleRemoveField(index)}
                className="shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddField}
        className="inline-flex items-center gap-x-1.5 text-sm font-medium text-purple-600 hover:text-purple-700"
      >
        <Plus className="size-4" />
        Add More
      </button>
    </div>
  );
}
