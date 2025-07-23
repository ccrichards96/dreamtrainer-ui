
import React from "react";

interface ButtonBlok {
  text: string;
  link?: string;
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'white' | 'link';
  color?: 'blue' | 'gray' | 'red' | 'yellow' | 'green' | 'indigo' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'default' | 'pill' | 'square';
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon_left?: string;
  icon_right?: string;
  target?: '_blank' | '_self';
  as_button?: boolean;
  onClick?: () => void;
}

const ButtonComponent = ({ blok }: { blok: ButtonBlok }) => {
  // Default values based on Preline UI patterns
  const variant = blok.variant || 'solid';
  const color = blok.color || 'blue';
  const size = blok.size || 'md';
  const shape = blok.shape || 'default';

  // Base classes following Preline UI patterns
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-x-2',
    'font-semibold',
    'transition-all',
    'duration-200',
    'ease-in-out',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2'
  ];

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  // Shape variants
  const shapeClasses = {
    default: 'rounded-lg',
    pill: 'rounded-full',
    square: 'rounded-none'
  };

  // Color and variant combinations following Preline patterns
  const variantClasses = {
    solid: {
      blue: 'bg-blue-600 text-white border border-transparent hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
      gray: 'bg-gray-800 text-white border border-transparent hover:bg-gray-900 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none',
      red: 'bg-red-600 text-white border border-transparent hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none',
      yellow: 'bg-yellow-500 text-white border border-transparent hover:bg-yellow-600 focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none',
      green: 'bg-green-600 text-white border border-transparent hover:bg-green-700 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none',
      indigo: 'bg-indigo-600 text-white border border-transparent hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none',
      purple: 'bg-purple-600 text-white border border-transparent hover:bg-purple-700 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none',
      pink: 'bg-pink-600 text-white border border-transparent hover:bg-pink-700 focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none'
    },
    outline: {
      blue: 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
      gray: 'border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none',
      red: 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none',
      yellow: 'border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none',
      green: 'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none',
      indigo: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none',
      purple: 'border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none',
      pink: 'border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none'
    },
    ghost: {
      blue: 'text-blue-600 hover:bg-blue-100 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
      gray: 'text-gray-800 hover:bg-gray-100 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none',
      red: 'text-red-600 hover:bg-red-100 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none',
      yellow: 'text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none',
      green: 'text-green-600 hover:bg-green-100 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none',
      indigo: 'text-indigo-600 hover:bg-indigo-100 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none',
      purple: 'text-purple-600 hover:bg-purple-100 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none',
      pink: 'text-pink-600 hover:bg-pink-100 focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none'
    },
    soft: {
      blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
      gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none',
      red: 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none',
      yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none',
      green: 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none',
      indigo: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none',
      purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none',
      pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200 focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none'
    },
    white: {
      blue: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none',
      gray: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none',
      red: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-red-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none',
      yellow: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-yellow-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none',
      green: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-green-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none',
      indigo: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none',
      purple: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-purple-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none',
      pink: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-pink-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none'
    },
    link: {
      blue: 'text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
      gray: 'text-gray-600 hover:text-gray-700 underline-offset-4 hover:underline focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none',
      red: 'text-red-600 hover:text-red-700 underline-offset-4 hover:underline focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none',
      yellow: 'text-yellow-600 hover:text-yellow-700 underline-offset-4 hover:underline focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none',
      green: 'text-green-600 hover:text-green-700 underline-offset-4 hover:underline focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none',
      indigo: 'text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none',
      purple: 'text-purple-600 hover:text-purple-700 underline-offset-4 hover:underline focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none',
      pink: 'text-pink-600 hover:text-pink-700 underline-offset-4 hover:underline focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none'
    }
  };

  // Combine all classes
  const buttonClasses = [
    ...baseClasses,
    sizeClasses[size],
    shapeClasses[shape],
    variantClasses[variant][color],
    blok.block ? 'w-full' : '',
    blok.loading ? 'cursor-wait' : '',
  ].filter(Boolean).join(' ');

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
  const Icon = ({ name, className = "h-4 w-4" }: { name: string; className?: string }) => {
    // This is a placeholder - replace with your actual icon implementation
    return <span className={`icon-${name} ${className}`} />;
  };

  const buttonContent = (
    <>
      {blok.loading && <LoadingSpinner />}
      {blok.icon_left && !blok.loading && <Icon name={blok.icon_left} />}
      {blok.loading ? 'Loading...' : blok.text}
      {blok.icon_right && !blok.loading && <Icon name={blok.icon_right} />}
    </>
  );

  // Render as button or link based on props
  if (blok.as_button || blok.onClick) {
    return (
      <button
        type="button"
        className={buttonClasses}
        disabled={blok.disabled || blok.loading}
        onClick={blok.onClick}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <a
      href={blok.link}
      target={blok.target}
      className={buttonClasses}
      {...(blok.disabled && { 'aria-disabled': 'true', tabIndex: -1 })}
    >
      {buttonContent}
    </a>
  );
};

export default ButtonComponent;
