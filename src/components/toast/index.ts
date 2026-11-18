import Toastify, { type ToastifyInstance } from "toastify-js/src/toastify-es.js";
import "toastify-js/src/toastify.css";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  /** Optional secondary line under the main message. */
  description?: string;
  /** How long the toast stays visible, in ms. Defaults to 4000. Use -1 to keep it until dismissed. */
  duration?: number;
}

interface VariantStyle {
  /** Tailwind classes for the icon circle. */
  iconWrapper: string;
  /** Inline SVG markup for the variant icon. */
  icon: string;
}

const variantStyles: Record<ToastVariant, VariantStyle> = {
  success: {
    iconWrapper: "bg-green-100 text-green-600",
    icon: '<path d="M20 6 9 17l-5-5"/>',
  },
  error: {
    iconWrapper: "bg-red-100 text-red-600",
    icon: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  },
  info: {
    iconWrapper: "bg-blue-100 text-blue-600",
    icon: '<path d="M12 16v-4"/><path d="M12 8h.01"/><circle cx="12" cy="12" r="10"/>',
  },
  warning: {
    iconWrapper: "bg-amber-100 text-amber-600",
    icon: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  },
};

const svgIcon = (paths: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const buildNode = (
  variant: ToastVariant,
  message: string,
  description: string | undefined,
  onClose: () => void
): HTMLElement => {
  const style = variantStyles[variant];

  const card = document.createElement("div");
  card.className =
    "flex w-80 max-w-full items-start gap-x-3 rounded-xl border border-gray-100 bg-white p-4 shadow-lg";
  card.setAttribute("role", variant === "error" ? "alert" : "status");

  const iconWrapper = document.createElement("div");
  iconWrapper.className = `flex size-8 shrink-0 items-center justify-center rounded-full ${style.iconWrapper}`;
  iconWrapper.innerHTML = svgIcon(style.icon);

  const content = document.createElement("div");
  content.className = "flex-1 pt-0.5";

  const messageEl = document.createElement("p");
  messageEl.className = "text-sm font-semibold text-gray-800";
  messageEl.textContent = message;
  content.appendChild(messageEl);

  if (description) {
    const descriptionEl = document.createElement("p");
    descriptionEl.className = "mt-0.5 text-sm text-gray-500";
    descriptionEl.textContent = description;
    content.appendChild(descriptionEl);
  }

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close notification");
  closeButton.className =
    "-mr-1 -mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300";
  closeButton.innerHTML = svgIcon('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>');
  closeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    onClose();
  });

  card.append(iconWrapper, content, closeButton);
  return card;
};

const show = (variant: ToastVariant, message: string, options: ToastOptions = {}) => {
  const node = buildNode(variant, message, options.description, () => instance.hideToast());

  const instance: ToastifyInstance = Toastify({
    node,
    duration: options.duration ?? 4000,
    gravity: "top",
    position: "right",
    close: false,
    stopOnFocus: true,
    // Neutralize Toastify's default gradient/padding so our card is the visible surface.
    style: {
      background: "none",
      boxShadow: "none",
      padding: "0",
      borderRadius: "0.75rem",
    },
    className: "dt-toast",
  });

  instance.showToast();
  return instance;
};

/**
 * Global toast notifications built on Toastify.js, styled to match the app.
 * Callable from anywhere in the app: `toast.success("Saved")`.
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => show("success", message, options),
  error: (message: string, options?: ToastOptions) => show("error", message, options),
  info: (message: string, options?: ToastOptions) => show("info", message, options),
  warning: (message: string, options?: ToastOptions) => show("warning", message, options),
};

export default toast;
