import { useState } from "react";
import { OfferFormData } from "../types";
import {
  DEFAULT_ACCEPTANCE_EMAIL,
  DEFAULT_REJECTION_EMAIL,
  EMAIL_MERGE_TAGS,
} from "../defaultEmailTemplates";
import { OfferEmailTemplate } from "../../../../types/offers";
import RichTextEditor, { TOOLBAR_BASIC } from "../../../../components/RichTextEditor";
import FormField, { fieldInputClass } from "./FormField";

interface EmailTemplatesSectionProps {
  form: OfferFormData;
  onChange: (patch: Partial<OfferFormData>) => void;
}

interface TemplateEditorProps {
  id: string;
  title: string;
  description: string;
  subjectPlaceholder: string;
  bodyPlaceholder: string;
  value: OfferEmailTemplate;
  defaultValue: OfferEmailTemplate;
  onChange: (value: OfferEmailTemplate) => void;
}

function TemplateEditor({
  id,
  title,
  description,
  subjectPlaceholder,
  bodyPlaceholder,
  value,
  defaultValue,
  onChange,
}: TemplateEditorProps) {
  // RichTextEditor only reads `value` on mount, so bump its key to load the reset content.
  const [editorKey, setEditorKey] = useState(0);
  const isDefault = value.subject === defaultValue.subject && value.body === defaultValue.body;

  const handleReset = () => {
    if (!window.confirm(`Replace your ${title.toLowerCase()} with the standard template?`)) return;
    onChange(defaultValue);
    setEditorKey((key) => key + 1);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {!isDefault && (
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
          >
            Reset to standard template
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>

      <div className="mt-4 space-y-5">
        <FormField label="Subject" htmlFor={`${id}-subject`}>
          <input
            id={`${id}-subject`}
            type="text"
            value={value.subject}
            onChange={(e) => onChange({ ...value, subject: e.target.value })}
            placeholder={subjectPlaceholder}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Message">
          <RichTextEditor
            key={editorKey}
            value={value.body}
            onChange={(body) => onChange({ ...value, body })}
            placeholder={bodyPlaceholder}
            toolbar={TOOLBAR_BASIC}
            minHeight={220}
          />
        </FormField>
      </div>
    </div>
  );
}

export default function EmailTemplatesSection({ form, onChange }: EmailTemplatesSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 underline underline-offset-4">
        Email Templates
      </h2>
      <p className="mt-3 text-sm text-gray-500">
        Start from the standard templates below and edit them as needed. These placeholders are
        filled in automatically when the email is sent:{" "}
        {EMAIL_MERGE_TAGS.map((tag, index) => (
          <span key={tag}>
            {index > 0 && ", "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs text-gray-700">{tag}</code>
          </span>
        ))}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <TemplateEditor
          id="acceptance-email"
          title="Acceptance Email"
          description="Sent to an applicant when they are accepted for this offer."
          subjectPlaceholder="Congratulations — you've been accepted!"
          bodyPlaceholder="Let the applicant know they've been accepted and what happens next..."
          value={form.acceptanceEmail}
          defaultValue={DEFAULT_ACCEPTANCE_EMAIL}
          onChange={(acceptanceEmail) => onChange({ acceptanceEmail })}
        />
        <TemplateEditor
          id="rejection-email"
          title="Rejection Email"
          description="The standard message sent to applicants who are not selected."
          subjectPlaceholder="An update on your application"
          bodyPlaceholder="Thank the applicant for their interest and let them know..."
          value={form.rejectionEmail}
          defaultValue={DEFAULT_REJECTION_EMAIL}
          onChange={(rejectionEmail) => onChange({ rejectionEmail })}
        />
      </div>
    </div>
  );
}
