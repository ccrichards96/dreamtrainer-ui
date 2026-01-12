/**
 * Utility functions for form validation and data sanitization
 */

/**
 * Validates a name field (first name or last name)
 * @param name - The name to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { isValid: false, error: "Name is required" };
  }

  if (trimmedName.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: "Name must be less than 50 characters" };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }

  return { isValid: true };
};

/**
 * Sanitizes a name by trimming whitespace and capitalizing appropriately
 * @param name - The name to sanitize
 * @returns Sanitized name
 */
export const sanitizeName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Validates onboarding data for completeness and integrity
 * @param data - The onboarding data to validate
 * @returns Object with isValid boolean and errors array
 */
export const validateOnboardingData = (data: {
  firstName?: string;
  lastName?: string;
  howDidYouHearAboutUs?: string;
  englishProficiency?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate first name
  if (!data.firstName) {
    errors.push("First name is required");
  } else {
    const firstNameValidation = validateName(data.firstName);
    if (!firstNameValidation.isValid && firstNameValidation.error) {
      errors.push(`First name: ${firstNameValidation.error}`);
    }
  }

  // Validate last name
  if (!data.lastName) {
    errors.push("Last name is required");
  } else {
    const lastNameValidation = validateName(data.lastName);
    if (!lastNameValidation.isValid && lastNameValidation.error) {
      errors.push(`Last name: ${lastNameValidation.error}`);
    }
  }

  // Validate how did you hear about us
  if (!data.howDidYouHearAboutUs || !data.howDidYouHearAboutUs.trim()) {
    errors.push("Please tell us how you heard about us");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
