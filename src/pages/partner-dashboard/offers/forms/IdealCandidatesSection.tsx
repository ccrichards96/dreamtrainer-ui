import { OfferFormData } from "../types";
import FormField, { fieldInputClass } from "./FormField";

interface IdealCandidatesSectionProps {
  form: OfferFormData;
  onChange: (patch: Partial<OfferFormData>) => void;
}

export default function IdealCandidatesSection({ form, onChange }: IdealCandidatesSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 underline underline-offset-4">
        Ideal Candidates
      </h2>

      <div className="mt-6 space-y-5">
        <FormField label="Characteristics (Desired Traits)" htmlFor="offer-characteristics">
          <input
            id="offer-characteristics"
            type="text"
            value={form.characteristics}
            onChange={(e) => onChange({ characteristics: e.target.value })}
            placeholder="-"
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Expectations (Desired Behaviors)" htmlFor="offer-expectations">
          <input
            id="offer-expectations"
            type="text"
            value={form.expectations}
            onChange={(e) => onChange({ expectations: e.target.value })}
            placeholder="Attend at least 90% of classes"
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Desired Offer Outcomes" htmlFor="offer-outcomes">
          <input
            id="offer-outcomes"
            type="text"
            value={form.outcomes}
            onChange={(e) => onChange({ outcomes: e.target.value })}
            placeholder="Graduate from Tufts"
            className={fieldInputClass}
          />
        </FormField>
      </div>
    </div>
  );
}
