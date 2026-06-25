import { OfferFormData } from "../types";
import FormField, { fieldInputClass } from "./FormField";
import RequirementsList from "./RequirementsList";

interface OfferDetailsSectionProps {
  form: OfferFormData;
  onChange: (patch: Partial<OfferFormData>) => void;
}

export default function OfferDetailsSection({ form, onChange }: OfferDetailsSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 underline underline-offset-4">
        Offer Details
      </h2>

      <div className="mt-6 space-y-5">
        <FormField label="Offer Name" htmlFor="offer-name">
          <input
            id="offer-name"
            type="text"
            value={form.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Guaranteed Admission Review for Tufts"
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Offer Description" htmlFor="offer-description">
          <textarea
            id="offer-description"
            value={form.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Get your application reviewed by a real admission team and get feedback"
            rows={3}
            className={`${fieldInputClass} resize-none`}
          />
        </FormField>

        <FormField label="Requirements">
          <RequirementsList
            requirements={form.requirements}
            onChange={(requirements) => onChange({ requirements })}
          />
        </FormField>
      </div>
    </div>
  );
}
