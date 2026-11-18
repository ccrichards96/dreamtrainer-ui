import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface GreCaptcha {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    }
  ) => number;
  reset: (widgetId?: number) => void;
}

declare global {
  interface Window {
    grecaptcha?: GreCaptcha;
    __onRecaptchaLoad?: () => void;
  }
}

export interface RecaptchaHandle {
  reset: () => void;
}

interface RecaptchaProps {
  siteKey?: string;
  /** Called with a token when solved, or null when it expires / errors / is reset. */
  onChange: (token: string | null) => void;
}

const SCRIPT_ID = "google-recaptcha-script";
let scriptPromise: Promise<void> | null = null;

/** Load the reCAPTCHA script once, shared by every widget on the page. */
const loadRecaptchaScript = (): Promise<void> => {
  if (window.grecaptcha?.render) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    window.__onRecaptchaLoad = () => resolve();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://www.google.com/recaptcha/api.js?onload=__onRecaptchaLoad&render=explicit";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      script.remove();
      scriptPromise = null; // allow a retry on the next mount
      reject(new Error("Failed to load reCAPTCHA"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};

/** Google reCAPTCHA v2 ("I'm not a robot") checkbox. */
const Recaptcha = forwardRef<RecaptchaHandle, RecaptchaProps>(({ siteKey, onChange }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current !== null) window.grecaptcha?.reset(widgetIdRef.current);
      onChangeRef.current(null);
    },
  }));

  useEffect(() => {
    if (!siteKey) {
      console.error("VITE_RECAPTCHA_SITE_KEY is not set — the contact form cannot be verified.");
      return;
    }

    let cancelled = false;

    loadRecaptchaScript()
      .then(() => {
        const container = containerRef.current;
        if (cancelled || !container || container.hasChildNodes() || !window.grecaptcha) return;

        widgetIdRef.current = window.grecaptcha.render(container, {
          sitekey: siteKey,
          callback: (token) => onChangeRef.current(token),
          "expired-callback": () => onChangeRef.current(null),
          "error-callback": () => onChangeRef.current(null),
        });
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  return <div ref={containerRef} />;
});

Recaptcha.displayName = "Recaptcha";

export default Recaptcha;
