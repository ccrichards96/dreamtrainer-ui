import { OfferFormData } from "../types";
import FormField from "./FormField";
import DynamicListField from "./DynamicListField";

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
        <FormField label="Characteristics (Desired Traits)">
          <DynamicListField
            values={form.characteristics}
            onChange={(characteristics) => onChange({ characteristics })}
            itemLabel="characteristic"
          />
        </FormField>

        <FormField label="Expectations (Desired Behaviors)">
          <DynamicListField
            values={form.expectations}
            onChange={(expectations) => onChange({ expectations })}
            itemLabel="expectation"
            placeholder="Attend at least 90% of classes"
          />
        </FormField>

        <FormField label="Desired Offer Outcomes">
          <DynamicListField
            values={form.outcomes}
            onChange={(outcomes) => onChange({ outcomes })}
            itemLabel="outcome"
            placeholder="Graduate from the program with a job offer"
          />
        </FormField>
      </div>
    </div>
  );
}
