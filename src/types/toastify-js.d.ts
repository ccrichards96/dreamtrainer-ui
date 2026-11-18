declare module "toastify-js/src/toastify-es.js" {
  export interface ToastifyOptions {
    text?: string;
    node?: Node;
    duration?: number;
    selector?: string | HTMLElement | ShadowRoot;
    destination?: string;
    newWindow?: boolean;
    close?: boolean;
    gravity?: "top" | "bottom";
    position?: "left" | "center" | "right";
    backgroundColor?: string;
    avatar?: string;
    className?: string;
    stopOnFocus?: boolean;
    onClick?: () => void;
    offset?: { x?: number | string; y?: number | string };
    escapeMarkup?: boolean;
    ariaLive?: "off" | "polite" | "assertive";
    style?: Partial<CSSStyleDeclaration> & Record<string, string>;
    oldestFirst?: boolean;
  }

  export interface ToastifyInstance {
    showToast(): ToastifyInstance;
    hideToast(): void;
  }

  export default function Toastify(options?: ToastifyOptions): ToastifyInstance;
}
