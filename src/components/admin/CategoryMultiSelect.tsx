import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Category } from "../../types/categories";

interface CategoryMultiSelectProps {
  categories: Category[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  categories,
  selectedIds,
  onChange,
  disabled = false,
  placeholder = "Select categories…",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCategories = categories.filter((cat) => selectedIds.includes(cat.id));
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const toggleCategory = (categoryId: string) => {
    if (selectedIds.includes(categoryId)) {
      onChange(selectedIds.filter((id) => id !== categoryId));
    } else {
      onChange([...selectedIds, categoryId]);
    }
  };

  const removeCategory = (categoryId: string) => {
    onChange(selectedIds.filter((id) => id !== categoryId));
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        role="combobox"
        aria-expanded={open}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        className={`w-full min-h-[42px] px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm flex items-center justify-between gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 py-0.5">
          {selectedCategories.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selectedCategories.map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md text-xs font-medium"
              >
                {cat.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(cat.id);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      </div>

      {open && (
        <div
          className="absolute z-50 w-full mt-1 max-h-72 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col"
          role="listbox"
          aria-multiselectable="true"
        >
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="p-1 overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <div className="py-3 px-4 text-sm text-gray-500 text-center">
                No matching categories
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isSelected = selectedIds.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggleCategory(cat.id)}
                    className={`cursor-pointer py-2 px-3 w-full text-sm rounded-lg flex items-center gap-2 ${
                      isSelected ? "bg-blue-50 text-blue-800" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </span>
                    <span className="flex-1">{cat.name}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMultiSelect;
