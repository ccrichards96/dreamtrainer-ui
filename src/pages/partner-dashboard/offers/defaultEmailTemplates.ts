import type { OfferEmailTemplate } from "../../../types/offers";

/**
 * Merge tags partners can use in offer email templates. They are stored as-is
 * and must be replaced with real values when the email is sent.
 */
export const EMAIL_MERGE_TAGS = ["{{applicantFirstName}}", "{{offerTitle}}", "{{partnerName}}"];

/** Standard templates prefilled for offers that don't have their own yet. */
export const DEFAULT_ACCEPTANCE_EMAIL: OfferEmailTemplate = {
  subject: "Congratulations — you've been accepted for {{offerTitle}}",
  body: [
    "<p>Hi {{applicantFirstName}},</p>",
    "<p>We're delighted to let you know that your application for <strong>{{offerTitle}}</strong> has been accepted!</p>",
    "<p>We were impressed by your application and are excited to welcome you. We'll be in touch shortly with next steps, including details on timing and anything you'll need to prepare.</p>",
    "<p>In the meantime, if you have any questions, just reply to this email.</p>",
    "<p>Congratulations again,<br>{{partnerName}}</p>",
  ].join(""),
};

export const DEFAULT_REJECTION_EMAIL: OfferEmailTemplate = {
  subject: "An update on your application for {{offerTitle}}",
  body: [
    "<p>Hi {{applicantFirstName}},</p>",
    "<p>Thank you for applying for <strong>{{offerTitle}}</strong> and for the time you put into your application.</p>",
    "<p>We received many strong applications, and after careful consideration we won't be moving forward with yours on this occasion. This was a difficult decision and doesn't take away from what you've achieved.</p>",
    "<p>We encourage you to keep an eye out for future opportunities, and we wish you every success.</p>",
    "<p>Kind regards,<br>{{partnerName}}</p>",
  ].join(""),
};
