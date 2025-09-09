import React from "react";

interface ButtonBlok {
  text: string;
  link?: string | { url?: string; cached_url?: string; linktype?: string };
  variant?: "solid" | "outline" | "ghost" | "soft" | "white" | "link";
  color?:
    | "blue"
    | "gray"
    | "red"
    | "yellow"
    | "green"
    | "indigo"
    | "purple"
    | "pink";
  size?: "sm" | "md" | "lg";
  shape?: "default" | "pill" | "square";
  block?: boolean;
  full_width?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon_left?: string;
  icon_right?: string;
  target?: "_blank" | "_self";
  as_button?: boolean;
  // Spacing parameters
  margin?: string;
  margin_top?: string;
  margin_bottom?: string;
  margin_left?: string;
  margin_right?: string;
  padding?: string;
  padding_top?: string;
  padding_bottom?: string;
  padding_left?: string;
  padding_right?: string;
}

const ButtonComponent = ({ blok }: { blok: ButtonBlok }) => {
  // Helper function to extract URL from Storyblok link
  const getLinkUrl = (
    link:
      | string
      | { url?: string; cached_url?: string; linktype?: string }
      | undefined,
  ): string | undefined => {
    if (!link) return undefined;
    if (typeof link === "string") return link;
    if (typeof link === "object") {
      return link.url || link.cached_url;
    }
    return undefined;
  };

  // Default values based on Preline UI patterns
  const variant = blok.variant || "solid";
  const color = blok.color || "blue";
  const size = blok.size || "md";
  const shape = blok.shape || "default";

  // Base classes following Preline UI patterns
  const baseClasses = [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-x-2",
    "font-semibold",
    "transition-all",
    "duration-200",
    "ease-in-out",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
  ];

  // Size variants
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Handle spacing - this will be added to the final classes
  const spacingClasses = [];
  const customStyles: React.CSSProperties = {};

  // Handle margins
  if (blok.margin) {
    if (
      blok.margin.includes("px") ||
      blok.margin.includes("rem") ||
      blok.margin.includes("em") ||
      blok.margin.includes("%")
    ) {
      customStyles.margin = blok.margin;
    } else {
      spacingClasses.push(`m-${blok.margin}`);
    }
  }

  if (blok.margin_top) {
    if (
      blok.margin_top.includes("px") ||
      blok.margin_top.includes("rem") ||
      blok.margin_top.includes("em") ||
      blok.margin_top.includes("%")
    ) {
      customStyles.marginTop = blok.margin_top;
    } else {
      spacingClasses.push(`mt-${blok.margin_top}`);
    }
  }

  if (blok.margin_bottom) {
    if (
      blok.margin_bottom.includes("px") ||
      blok.margin_bottom.includes("rem") ||
      blok.margin_bottom.includes("em") ||
      blok.margin_bottom.includes("%")
    ) {
      customStyles.marginBottom = blok.margin_bottom;
    } else {
      spacingClasses.push(`mb-${blok.margin_bottom}`);
    }
  }

  if (blok.margin_left) {
    if (
      blok.margin_left.includes("px") ||
      blok.margin_left.includes("rem") ||
      blok.margin_left.includes("em") ||
      blok.margin_left.includes("%")
    ) {
      customStyles.marginLeft = blok.margin_left;
    } else {
      spacingClasses.push(`ml-${blok.margin_left}`);
    }
  }

  if (blok.margin_right) {
    if (
      blok.margin_right.includes("px") ||
      blok.margin_right.includes("rem") ||
      blok.margin_right.includes("em") ||
      blok.margin_right.includes("%")
    ) {
      customStyles.marginRight = blok.margin_right;
    } else {
      spacingClasses.push(`mr-${blok.margin_right}`);
    }
  }

  // Handle custom padding (will override size-based padding if provided)
  if (blok.padding) {
    if (
      blok.padding.includes("px") ||
      blok.padding.includes("rem") ||
      blok.padding.includes("em") ||
      blok.padding.includes("%")
    ) {
      customStyles.padding = blok.padding;
    } else {
      spacingClasses.push(`p-${blok.padding}`);
    }
  }

  if (blok.padding_top) {
    if (
      blok.padding_top.includes("px") ||
      blok.padding_top.includes("rem") ||
      blok.padding_top.includes("em") ||
      blok.padding_top.includes("%")
    ) {
      customStyles.paddingTop = blok.padding_top;
    } else {
      spacingClasses.push(`pt-${blok.padding_top}`);
    }
  }

  if (blok.padding_bottom) {
    if (
      blok.padding_bottom.includes("px") ||
      blok.padding_bottom.includes("rem") ||
      blok.padding_bottom.includes("em") ||
      blok.padding_bottom.includes("%")
    ) {
      customStyles.paddingBottom = blok.padding_bottom;
    } else {
      spacingClasses.push(`pb-${blok.padding_bottom}`);
    }
  }

  if (blok.padding_left) {
    if (
      blok.padding_left.includes("px") ||
      blok.padding_left.includes("rem") ||
      blok.padding_left.includes("em") ||
      blok.padding_left.includes("%")
    ) {
      customStyles.paddingLeft = blok.padding_left;
    } else {
      spacingClasses.push(`pl-${blok.padding_left}`);
    }
  }

  if (blok.padding_right) {
    if (
      blok.padding_right.includes("px") ||
      blok.padding_right.includes("rem") ||
      blok.padding_right.includes("em") ||
      blok.padding_right.includes("%")
    ) {
      customStyles.paddingRight = blok.padding_right;
    } else {
      spacingClasses.push(`pr-${blok.padding_right}`);
    }
  }

  // Shape variants
  const shapeClasses = {
    default: "rounded-lg",
    pill: "rounded-full",
    square: "rounded-none",
  };

  // Color and variant combinations following Preline patterns
  const variantClasses = {
    solid: {
      blue: "bg-blue-600 text-white border border-transparent hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
      gray: "bg-gray-800 text-white border border-transparent hover:bg-gray-900 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none",
      red: "bg-red-600 text-white border border-transparent hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none",
      yellow:
        "bg-yellow-500 text-white border border-transparent hover:bg-yellow-600 focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none",
      green:
        "bg-green-600 text-white border border-transparent hover:bg-green-700 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none",
      indigo:
        "bg-indigo-600 text-white border border-transparent hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none",
      purple:
        "bg-purple-600 text-white border border-transparent hover:bg-purple-700 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none",
      pink: "bg-pink-600 text-white border border-transparent hover:bg-pink-700 focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none",
    },
    outline: {
      blue: "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
      gray: "border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none",
      red: "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none",
      yellow:
        "border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none",
      green:
        "border border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none",
      indigo:
        "border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none",
      purple:
        "border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none",
      pink: "border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none",
    },
    ghost: {
      blue: "text-blue-600 hover:bg-blue-100 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
      gray: "text-gray-800 hover:bg-gray-100 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none",
      red: "text-red-600 hover:bg-red-100 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none",
      yellow:
        "text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none",
      green:
        "text-green-600 hover:bg-green-100 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none",
      indigo:
        "text-indigo-600 hover:bg-indigo-100 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none",
      purple:
        "text-purple-600 hover:bg-purple-100 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none",
      pink: "text-pink-600 hover:bg-pink-100 focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none",
    },
    soft: {
      blue: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
      gray: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none",
      red: "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none",
      yellow:
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none",
      green:
        "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none",
      indigo:
        "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none",
      purple:
        "bg-purple-100 text-purple-800 hover:bg-purple-200 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none",
      pink: "bg-pink-100 text-pink-800 hover:bg-pink-200 focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none",
    },
    white: {
      blue: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none",
      gray: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none",
      red: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-red-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none",
      yellow:
        "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-yellow-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none",
      green:
        "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-green-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none",
      indigo:
        "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none",
      purple:
        "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-purple-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none",
      pink: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-pink-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none",
    },
    link: {
      blue: "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
      gray: "text-gray-600 hover:text-gray-700 underline-offset-4 hover:underline focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none",
      red: "text-red-600 hover:text-red-700 underline-offset-4 hover:underline focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none",
      yellow:
        "text-yellow-600 hover:text-yellow-700 underline-offset-4 hover:underline focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none",
      green:
        "text-green-600 hover:text-green-700 underline-offset-4 hover:underline focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none",
      indigo:
        "text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none",
      purple:
        "text-purple-600 hover:text-purple-700 underline-offset-4 hover:underline focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none",
      pink: "text-pink-600 hover:text-pink-700 underline-offset-4 hover:underline focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none",
    },
  };

  // Combine all classes
  const buttonClasses = [
    ...baseClasses,
    sizeClasses[size],
    shapeClasses[shape],
    variantClasses[variant][color],
    ...spacingClasses,
    blok.block || blok.full_width ? "w-full" : "",
    blok.loading ? "cursor-wait" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Icon component (you can replace this with your preferred icon library)
  const Icon = ({
    name,
    className = "h-4 w-4",
  }: {
    name: string;
    className?: string;
  }) => {
    // This is a placeholder - replace with your actual icon implementation
    return <span className={`icon-${name} ${className}`} />;
  };

  const buttonContent = (
    <>
      {blok.loading && <LoadingSpinner />}
      {blok.icon_left && !blok.loading && <Icon name={blok.icon_left} />}
      {blok.loading ? "Loading..." : blok.text}
      {blok.icon_right && !blok.loading && <Icon name={blok.icon_right} />}
    </>
  );

  // Render as button or link based on props
  if (blok.as_button) {
    return (
      <button
        type="button"
        className={buttonClasses}
        style={customStyles}
        disabled={blok.disabled || blok.loading}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <a
      href={getLinkUrl(blok.link)}
      target={blok.target}
      className={buttonClasses}
      style={customStyles}
      {...(blok.disabled && { "aria-disabled": "true", tabIndex: -1 })}
    >
      {buttonContent}
    </a>
  );
};

export default ButtonComponent;
