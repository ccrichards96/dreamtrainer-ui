import { OfferFormData } from "../types";
import FormField, { fieldInputClass } from "./FormField";
import OfferImageField from "./OfferImageField";
import DynamicListField from "./DynamicListField";

interface OfferDetailsSectionProps {
  form: OfferFormData;
  onChange: (patch: Partial<OfferFormData>) => void;
  /** Course the offer belongs to — needed to upload the cover image. */
  courseId: string | null;
}

export default function OfferDetailsSection({
  form,
  onChange,
  courseId,
}: OfferDetailsSectionProps) {
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
            placeholder="Guaranteed Admission Review for Dream School"
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

        <FormField label="Offer Image">
          <OfferImageField
            value={form.imageUrl}
            onChange={(imageUrl) => onChange({ imageUrl })}
            courseId={courseId}
          />
        </FormField>

        <FormField label="Requirements">
          <DynamicListField
            values={form.requirements}
            onChange={(requirements) => onChange({ requirements })}
            itemLabel="requirement"
          />
        </FormField>
      </div>
    </div>
  );
}
