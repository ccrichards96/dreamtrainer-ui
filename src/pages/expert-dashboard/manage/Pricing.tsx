import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useExpertDashboardContext } from "../../../contexts";

export default function Pricing() {
  const { courseManageData, saveCoursePricing, course } = useExpertDashboardContext();
  const [price, setPrice] = useState(courseManageData.pricing.price);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setPrice(courseManageData.pricing.price);
  }, [courseManageData.pricing.price]);

  const handleSave = async () => {
    if (!course) return;
    const amount = parseFloat(price);
    if (isNaN(amount) || amount < 5) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await saveCoursePricing(course.id, amount);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save pricing");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="price" className="block text-sm font-bold text-gray-900">
            Set a Course Price
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Set the price for your course in USD. You can update this later if needed. (Minimum
            $5.00)
          </p>
        </div>

        <div className="relative max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">$</span>
          <input
            type="number"
            id="price"
            min="5"
            step="1.00"
            defaultValue={"5"}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="5.00"
            className="block w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && (
          <p className="flex items-center gap-1.5 text-sm text-green-600">
            <Check className="size-4" />
            Price saved successfully
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="py-2.5 px-5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Price"}
        </button>
      </div>
    </div>
  );
}
