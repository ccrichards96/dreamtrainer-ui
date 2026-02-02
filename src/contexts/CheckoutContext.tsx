import { createContext, ReactNode, useState, useCallback } from "react";
import type { Course } from "../types/modules";
import type { CoursePricing } from "../types/billing";
import { getCourseBySlug } from "../services/api/modules";
import { getCoursePricing } from "../services/api/billing";

/**
 * Active checkout data - stores course and pricing info for checkout flow
 */
export interface ActiveCheckoutData {
  course: Course;
  pricing: CoursePricing;
}

export interface CheckoutContextType {
  activeCheckout: ActiveCheckoutData | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadCheckoutData: (slug: string) => Promise<ActiveCheckoutData>;
  clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

interface CheckoutProviderProps {
  children: ReactNode;
}

export function CheckoutProvider({ children }: CheckoutProviderProps) {
  const [activeCheckout, setActiveCheckout] = useState<ActiveCheckoutData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load course and pricing data for checkout
   * Returns cached data if already loaded for the same course slug
   */
  const loadCheckoutData = useCallback(
    async (slug: string): Promise<ActiveCheckoutData> => {
      // Return cached data if we already have it for this course
      if (activeCheckout && activeCheckout.course.slug === slug) {
        return activeCheckout;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch course details
        const courseResponse = await getCourseBySlug(slug);
        const course = courseResponse.data;

        // Fetch pricing information
        const pricing = await getCoursePricing(course.id);

        const checkoutData: ActiveCheckoutData = { course, pricing };
        setActiveCheckout(checkoutData);

        return checkoutData;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load checkout data";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [activeCheckout]
  );

  /**
   * Clear checkout data (e.g., after successful purchase or navigation away)
   */
  const clearCheckout = useCallback(() => {
    setActiveCheckout(null);
    setError(null);
  }, []);

  const value: CheckoutContextType = {
    activeCheckout,
    loading,
    error,
    loadCheckoutData,
    clearCheckout,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export { CheckoutContext };
