import { useContext } from "react";
import { CheckoutContext, CheckoutContextType } from "./CheckoutContext";

export function useCheckoutContext(): CheckoutContextType {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckoutContext must be used within a CheckoutProvider");
  }
  return context;
}
