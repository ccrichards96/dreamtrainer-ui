import React, { useMemo, useRef, useState } from "react";
import { storyblokEditable, SbBlokData } from "@storyblok/react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Loader, Send } from "lucide-react";
import { submitContactForm, DEFAULT_CONTACT_ENDPOINT } from "../../services/api/contact";
import Recaptcha, { RecaptchaHandle } from "../forms/Recaptcha";

interface ContactFormBlok extends SbBlokData {
  // Header copy
  title?: string;
  description?: string;

  // Optional fields
  show_phone?: boolean;
  phone_required?: boolean;
  show_company?: boolean;
  company_required?: boolean;
  company_label?: string;

  // Topic dropdown — one option per line; hidden when empty
  topic_label?: string;
  topic_options?: string;

  // Message field
  message_label?: string;
  message_placeholder?: string;
  message_rows?: string;

  // Consent checkbox
  show_consent?: boolean;
  consent_text?: string;

  // Submit + success copy
  submit_text?: string;
  success_title?: string;
  success_message?: string;

  // Styling
  form_style?: "card" | "plain";
  button_color?: "blue" | "indigo" | "gray";
  full_width_button?: boolean;
  custom_classes?: string;

  // Advanced
  form_name?: string;
  endpoint?: string;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  topic: string;
  message: string;
  consent: boolean;
  // Honeypot — real users never see or fill this field
  website: string;
}

type FormErrors = Partial<Record<keyof FormValues | "recaptcha", string>>;
type FormStatus = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  topic: "",
  message: "",
  consent: false,
  website: "",
};

const buttonColorClasses = {
  blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  indigo: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
  gray: "bg-gray-800 hover:bg-gray-900 focus:ring-gray-500",
};

const inputBaseClasses =
  "block w-full rounded-lg border px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none";

const ContactForm: React.FC<{ blok: ContactFormBlok }> = ({ blok }) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitError, setSubmitError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaHandle>(null);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const topicOptions = useMemo(
    () =>
      (blok.topic_options || "")
        .split("\n")
        .map((option) => option.trim())
        .filter(Boolean),
    [blok.topic_options]
  );

  const idPrefix = `contact-${blok._uid}`;
  const isSubmitting = status === "submitting";
  const buttonColor = buttonColorClasses[blok.button_color || "blue"];
  const companyLabel = blok.company_label || "Company";
  const topicLabel = blok.topic_label || "What can we help with?";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const nextValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setValues((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!values.firstName.trim()) next.firstName = "Please enter your first name.";
    if (!values.lastName.trim()) next.lastName = "Please enter your last name.";

    if (!values.email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL_PATTERN.test(values.email.trim()))
      next.email = "Please enter a valid email address.";

    if (blok.show_phone && blok.phone_required && !values.phone.trim())
      next.phone = "Please enter your phone number.";

    if (blok.show_company && blok.company_required && !values.company.trim())
      next.company = `Please enter your ${companyLabel.toLowerCase()}.`;

    if (topicOptions.length > 0 && !values.topic) next.topic = "Please choose a topic.";

    if (!values.message.trim()) next.message = "Please enter a message.";

    if (blok.show_consent && !values.consent) next.consent = "Please confirm to continue.";

    if (!recaptchaSiteKey)
      next.recaptcha = "Verification is unavailable right now. Please try again later.";
    else if (!recaptchaToken) next.recaptcha = "Please confirm you're not a robot.";

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstInvalid = Object.keys(validationErrors)[0];
      document.getElementById(`${idPrefix}-${firstInvalid}`)?.focus();
      return;
    }

    // Bots fill the honeypot — pretend it worked and drop the submission
    if (values.website) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    setSubmitError("");

    try {
      await submitContactForm(
        {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phone: blok.show_phone ? values.phone.trim() || undefined : undefined,
          company: blok.show_company ? values.company.trim() || undefined : undefined,
          topic: values.topic || undefined,
          message: values.message.trim(),
          consent: blok.show_consent ? values.consent : undefined,
          formName: blok.form_name || "contact",
          pageUrl: window.location.href,
          recaptchaToken: recaptchaToken as string,
        },
        blok.endpoint?.trim() || DEFAULT_CONTACT_ENDPOINT
      );
      setStatus("success");
      setValues(initialValues);
      setRecaptchaToken(null);
    } catch (error) {
      // A reCAPTCHA token is single-use, so the user has to solve a fresh one to retry
      recaptchaRef.current?.reset();
      setStatus("error");
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  };

  const fieldClasses = (field: keyof FormValues) =>
    `${inputBaseClasses} ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
    }`;

  const renderLabel = (field: keyof FormValues, label: string, required: boolean) => (
    <label
      htmlFor={`${idPrefix}-${field}`}
      className="block mb-2 text-sm font-medium text-gray-800"
    >
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  const renderError = (field: keyof FormValues) =>
    errors[field] ? (
      <p id={`${idPrefix}-${field}-error`} className="mt-2 text-xs text-red-600">
        {errors[field]}
      </p>
    ) : null;

  const ariaProps = (field: keyof FormValues) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${idPrefix}-${field}-error` : undefined,
  });

  const wrapperClasses = [
    blok.form_style === "plain"
      ? ""
      : "bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8",
    blok.custom_classes,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...storyblokEditable(blok)} className={wrapperClasses}>
      {(blok.title || blok.description) && (
        <div className="mb-8">
          {blok.title && (
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{blok.title}</h2>
          )}
          {blok.description && <p className="mt-2 text-gray-600">{blok.description}</p>}
        </div>
      )}

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
          role="status"
        >
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {blok.success_title || "Thanks for reaching out!"}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {blok.success_message || "We've received your message and will get back to you soon."}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor={`${idPrefix}-website`}>Website</label>
            <input
              id={`${idPrefix}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              {renderLabel("firstName", "First name", true)}
              <input
                id={`${idPrefix}-firstName`}
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={values.firstName}
                onChange={handleChange}
                disabled={isSubmitting}
                className={fieldClasses("firstName")}
                {...ariaProps("firstName")}
              />
              {renderError("firstName")}
            </div>
            <div>
              {renderLabel("lastName", "Last name", true)}
              <input
                id={`${idPrefix}-lastName`}
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={values.lastName}
                onChange={handleChange}
                disabled={isSubmitting}
                className={fieldClasses("lastName")}
                {...ariaProps("lastName")}
              />
              {renderError("lastName")}
            </div>
          </div>

          <div className={blok.show_phone ? "grid grid-cols-1 sm:grid-cols-2 gap-5" : ""}>
            <div>
              {renderLabel("email", "Email", true)}
              <input
                id={`${idPrefix}-email`}
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={fieldClasses("email")}
                {...ariaProps("email")}
              />
              {renderError("email")}
            </div>
            {blok.show_phone && (
              <div>
                {renderLabel("phone", "Phone", Boolean(blok.phone_required))}
                <input
                  id={`${idPrefix}-phone`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={fieldClasses("phone")}
                  {...ariaProps("phone")}
                />
                {renderError("phone")}
              </div>
            )}
          </div>

          {blok.show_company && (
            <div>
              {renderLabel("company", companyLabel, Boolean(blok.company_required))}
              <input
                id={`${idPrefix}-company`}
                name="company"
                type="text"
                autoComplete="organization"
                value={values.company}
                onChange={handleChange}
                disabled={isSubmitting}
                className={fieldClasses("company")}
                {...ariaProps("company")}
              />
              {renderError("company")}
            </div>
          )}

          {topicOptions.length > 0 && (
            <div>
              {renderLabel("topic", topicLabel, true)}
              <select
                id={`${idPrefix}-topic`}
                name="topic"
                value={values.topic}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`${fieldClasses("topic")} pe-9`}
                {...ariaProps("topic")}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {topicOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {renderError("topic")}
            </div>
          )}

          <div>
            {renderLabel("message", blok.message_label || "Message", true)}
            <textarea
              id={`${idPrefix}-message`}
              name="message"
              rows={Number(blok.message_rows) || 5}
              placeholder={blok.message_placeholder || "Tell us how we can help..."}
              value={values.message}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`${fieldClasses("message")} resize-y`}
              {...ariaProps("message")}
            />
            {renderError("message")}
          </div>

          {blok.show_consent && (
            <div>
              <div className="flex items-start gap-3">
                <input
                  id={`${idPrefix}-consent`}
                  name="consent"
                  type="checkbox"
                  checked={values.consent}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="mt-0.5 shrink-0 size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...ariaProps("consent")}
                />
                <label htmlFor={`${idPrefix}-consent`} className="text-sm text-gray-600">
                  {blok.consent_text ||
                    "I agree to be contacted by Dream Trainer about my enquiry."}
                </label>
              </div>
              {renderError("consent")}
            </div>
          )}

          <div>
            <Recaptcha
              ref={recaptchaRef}
              siteKey={recaptchaSiteKey}
              onChange={(token) => {
                setRecaptchaToken(token);
                if (token) setErrors((prev) => ({ ...prev, recaptcha: undefined }));
              }}
            />
            {errors.recaptcha && (
              <p id={`${idPrefix}-recaptcha-error`} className="mt-2 text-xs text-red-600">
                {errors.recaptcha}
              </p>
            )}
          </div>

          {status === "error" && submitError && (
            <div
              className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${buttonColor} ${
              blok.full_width_button === false ? "" : "w-full"
            } inline-flex items-center justify-center gap-x-2 px-6 py-3 text-sm font-semibold text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none`}
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {blok.submit_text || "Send message"}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
