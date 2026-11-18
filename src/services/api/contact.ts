import { isAxiosError } from "axios";
import apiClient from "./client";
import { APIResponse } from "../../types/api";

export const DEFAULT_CONTACT_ENDPOINT = "/contact";

export interface ContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  topic?: string;
  message: string;
  consent?: boolean;
  /** Identifies which form the submission came from (set in Storyblok). */
  formName: string;
  /** Page the form was submitted from. */
  pageUrl: string;
  /** Token from the reCAPTCHA v2 widget — verified with Google by the backend. */
  recaptchaToken: string;
}

/**
 * Submit a public contact form message.
 * @param submission - Contact form payload
 * @param endpoint - Optional override (relative to the API base URL, or an absolute URL)
 */
export const submitContactForm = async (
  submission: ContactSubmission,
  endpoint: string = DEFAULT_CONTACT_ENDPOINT
): Promise<void> => {
  try {
    await apiClient.post<APIResponse<void>>(endpoint, submission);
  } catch (error) {
    const serverMessage = isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message
      : undefined;
    throw new Error(serverMessage || "We couldn't send your message. Please try again.");
  }
};

const contactService = {
  submitContactForm,
};

export default contactService;
